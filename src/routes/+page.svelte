<script lang="ts">
import { onMount } from 'svelte';
	import type { Note } from '$lib/types';
import { notes, isLoading, isSubmitting, loadNotes, createNote, updateNote, deleteNote, pinNote } from '$lib/notes/notes.store';
	import { debouncedSearch } from '$lib/notes/search';
import { sortNotes, sortBy, sortOrder } from '$lib/notes/sort';
import type { SortOption, SortOrder } from '$lib/notes/sort';
	import { paginate, getTotalPages, currentPage } from '$lib/notes/pagination';
	import { theme } from '$lib/utils/dark-mode';
	import { syncStatus } from '$lib/stores/sync-status';
	import { syncPendingOperations } from '$lib/utils/offline-sync';
import { registerShortcuts } from '$lib/utils/shortcuts';
	import NotesToolbar from '$lib/components/NotesToolbar.svelte';
	import NotesList from '$lib/components/NotesList.svelte';
import NotesPagination from '$lib/components/NotesPagination.svelte';
import NotesModals from '$lib/components/NotesModals.svelte';
import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
import Toast from '$lib/components/Toast.svelte';
import Navbar from '$lib/components/Navbar.svelte';
import NoteCount from '$lib/components/NoteCount.svelte';

	let showCreateModal = $state(false);
	let editingNote: Note | null = $state(null);
	let deletingNote: Note | null = $state(null);
	let toastMessage = $state<{ message: string; type: 'success' | 'error' | 'info'; onUndo?: () => void } | null>(null);

// Track pending soft deletes (id -> timeout) so we can undo before permanent delete
const pendingDeletes = new Map<string, ReturnType<typeof setTimeout>>();




	// Memoized getDisplayNotes to avoid infinite loop
type DisplayDeps = {
	notes: Note[];
	debouncedSearch: string;
	sortBy: SortOption;
	sortOrder: SortOrder;
	currentPage: number;
};

let lastDeps: DisplayDeps | null = null;
let lastResult: Note[] = [];
	function getDisplayNotes() {
	const deps: DisplayDeps = {
		notes: $notes,
		debouncedSearch: $debouncedSearch,
		sortBy: $sortBy,
		sortOrder: $sortOrder,
		currentPage: $currentPage
	};
	const depsChanged =
		!lastDeps ||
		lastDeps.notes !== deps.notes ||
		lastDeps.debouncedSearch !== deps.debouncedSearch ||
		lastDeps.sortBy !== deps.sortBy ||
		lastDeps.sortOrder !== deps.sortOrder ||
		lastDeps.currentPage !== deps.currentPage;
	if (!depsChanged) return lastResult;
	let result = deps.notes;
	if (deps.debouncedSearch) {
		result = result.filter((n) => n.title.toLowerCase().includes(deps.debouncedSearch.toLowerCase()));
	}
	result = sortNotes(result, deps.sortBy, deps.sortOrder);
	result = paginate(result, deps.currentPage);
	lastDeps = deps;
	lastResult = result;
	return result;
	}

	function getTotalPagesCount() {
		let filtered = $notes;
		if ($debouncedSearch) {
			filtered = filtered.filter(n => n.title.toLowerCase().includes($debouncedSearch.toLowerCase()));
		}
		return getTotalPages(filtered.length);
	}

	// Handlers
	function handleCreateClick() {
		editingNote = null;
		showCreateModal = true;
	}

	function handleEditClick(note: Note) {
		editingNote = note;
	}

	function handleDeleteClick(note: Note) {
		deletingNote = note;
	}

async function handleCreate(data: Omit<Note, 'id' | 'createdAt'>) {
		try {
			await createNote(data);
			showToast('Note created successfully', 'success');
		} catch (error) {
			console.error('Failed to create note:', error);
			showToast('Failed to create note', 'error');
		} finally {
			// Always close modal and reset editing state after submission attempt
			isSubmitting.set(false);
			showCreateModal = false;
			editingNote = null;
		}
	}

function scheduleDelete(note: Note) {
	// Optimistically remove from UI
	notes.update((n) => n.filter((item) => item.id !== note.id));

	// Start timer to permanently delete after 10s
	const timeoutId = setTimeout(async () => {
		pendingDeletes.delete(note.id);
		try {
			await deleteNote(note.id);
		} catch (error) {
			console.error('Failed to delete note:', error);
			// Restore on failure
			notes.update((n) => [note, ...n.filter((item) => item.id !== note.id)]);
			showToast('Delete failed — note restored', 'error');
		}
	}, 10000);

	pendingDeletes.set(note.id, timeoutId);

	// Show toast with Undo
	showToast('Note deleted', 'info', () => handleUndoDelete(note));
}

function handleUndoDelete(note: Note) {
	const timeoutId = pendingDeletes.get(note.id);
	if (timeoutId) {
		clearTimeout(timeoutId);
		pendingDeletes.delete(note.id);
	}

	// Restore note to the top (avoid duplicates)
	notes.update((n) => {
		const without = n.filter((item) => item.id !== note.id);
		return [note, ...without];
	});

	showToast('Deletion undone', 'success');
}

	async function handleUpdate(data: Omit<Note, 'id' | 'createdAt'>) {
		if (editingNote) {
			try {
				await updateNote(editingNote.id, data);
				editingNote = null;
				showToast('Note updated successfully', 'success');
			} catch (error) {
				console.error('Failed to update note:', error);
				showToast('Failed to update note', 'error');
			}
		}
	}

	function handleDeleteConfirm() {
		if (deletingNote) {
			const noteToDelete = deletingNote;
			deletingNote = null;
			scheduleDelete(noteToDelete);
		}
	}

	function handleCloseModals() {
		showCreateModal = false;
		editingNote = null;
		deletingNote = null;
	}

	function showToast(message: string, type: 'success' | 'error' | 'info', onUndo?: () => void) {
		toastMessage = { message, type, onUndo };
		setTimeout(() => {
			if (toastMessage?.message === message) {
				toastMessage = null;
			}
		}, 5000);
	}

	onMount(() => {
		theme.init();
		syncStatus.init();
		loadNotes();
		const cleanupShortcuts = registerShortcuts({
			onNew: handleCreateClick,
			onCloseModals: handleCloseModals,
			isModalOpen: () => showCreateModal || editingNote !== null || deletingNote !== null
		});
		const handleOnline = async () => {
			syncStatus.set('syncing');
			await syncPendingOperations();
			await loadNotes();
			syncStatus.set('online');
		};
		const handleOffline = () => {
			syncStatus.set('offline');
		};
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);
		if (navigator.onLine) {
			syncPendingOperations();
		}
		return () => {
			cleanupShortcuts();
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	});
</script>

<svelte:window ononline={async () => { syncStatus.set('syncing'); await syncPendingOperations(); await loadNotes(); syncStatus.set('online'); }} onoffline={() => { syncStatus.set('offline'); }} />

<div class="relative min-h-screen flex flex-col bg-slate-100 dark:bg-[#0c2f36] text-slate-800 dark:text-white transition-colors">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30"></div>
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(13,185,146,0.05),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.08),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(0,0,0,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(13,185,146,0.08),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(210,255,64,0.12),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.06),transparent_50%)]"></div>

	<Navbar syncStatusStore={syncStatus} onToggleTheme={() => theme.toggle()} />

	<main class="relative z-10 flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full pt-28">
		<div class="mt-8">
			<NotesToolbar onCreate={handleCreateClick} onToast={showToast} />
		</div>
		{#if $isLoading}
			<LoadingSkeleton />
		{:else}
			{@const displayedNotes = getDisplayNotes()}
			<NoteCount displayedCount={displayedNotes.length} />
			<NotesList notes={displayedNotes} onEdit={handleEditClick} onDelete={handleDeleteClick} onPin={(note) => pinNote(note.id)} onCreate={handleCreateClick} />
		{/if}
		<NotesPagination totalPages={getTotalPagesCount()} />
	</main>

	<footer class="relative z-10 mt-auto py-4">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600 dark:text-teal-100">
			<p>
				View on
				<a
					href="https://github.com/yourusername/notes-app"
					target="_blank"
					rel="noopener noreferrer"
					class="ml-1 text-emerald-600 dark:text-lime-300 hover:text-emerald-500 dark:hover:text-lime-200 font-semibold"
				>
					GitHub
				</a>
			</p>
		</div>
	</footer>

	<NotesModals showCreate={showCreateModal} {editingNote} {deletingNote} isSubmitting={$isSubmitting} onCreate={handleCreate} onUpdate={handleUpdate} onDeleteConfirm={handleDeleteConfirm} onCloseModals={handleCloseModals} />

	{#if toastMessage}
		<Toast
			message={toastMessage.message}
			type={toastMessage.type}
			onClose={() => { toastMessage = null; }}
			onUndo={toastMessage.onUndo}
			duration={toastMessage.onUndo ? 10000 : 3000}
		/>
	{/if}
</div>
