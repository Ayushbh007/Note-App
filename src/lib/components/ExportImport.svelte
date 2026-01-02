<script lang="ts">
	import { notes, loadNotes } from '$lib/notes/notes.store';
	import { api } from '$lib/api';
	import type { Note } from '$lib/types';

	interface Props {
		onSuccess?: (message: string) => void;
		onError?: (message: string) => void;
	}

	let { onSuccess, onError }: Props = $props();

	let isExporting = $state(false);
	let isImporting = $state(false);
	let fileInput: HTMLInputElement;

	async function handleExport() {
		isExporting = true;
		try {
			const notesData = $notes.map(note => ({
				title: note.title,
				content: note.content,
				pinned: note.pinned,
				createdAt: note.createdAt,
				updatedAt: note.updatedAt
			}));

			const exportData = {
				version: '1.0',
				exportedAt: new Date().toISOString(),
				notesCount: notesData.length,
				notes: notesData
			};

			const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			
			const a = document.createElement('a');
			a.href = url;
			a.download = `notes-export-${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			onSuccess?.(`Exported ${notesData.length} notes successfully!`);
		} catch (error) {
			console.error('Export failed:', error);
			onError?.('Failed to export notes');
		} finally {
			isExporting = false;
		}
	}

	function triggerImport() {
		fileInput?.click();
	}

	async function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		
		if (!file) return;

		isImporting = true;
		try {
			const text = await file.text();
			const data = JSON.parse(text);

			if (!data.notes || !Array.isArray(data.notes)) {
				throw new Error('Invalid import file format');
			}

			let imported = 0;
			let skipped = 0;

			for (const noteData of data.notes) {
				if (!noteData.title || !noteData.content) {
					skipped++;
					continue;
				}

				try {
					await api.createNote({
						title: noteData.title,
						content: noteData.content,
						pinned: noteData.pinned ?? false
					});
					imported++;
				} catch (err) {
					console.error('Failed to import note:', err);
					skipped++;
				}
			}

			await loadNotes();

			if (skipped > 0) {
				onSuccess?.(`Imported ${imported} notes (${skipped} skipped)`);
			} else {
				onSuccess?.(`Imported ${imported} notes successfully!`);
			}
		} catch (error) {
			console.error('Import failed:', error);
			onError?.('Failed to import notes. Make sure the file is valid JSON.');
		} finally {
			isImporting = false;
			if (fileInput) fileInput.value = '';
		}
	}
</script>

<div class="flex gap-2">
	<button
		type="button"
		onclick={handleExport}
		disabled={isExporting || $notes.length === 0}
		class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
		title={$notes.length === 0 ? 'No notes to export' : 'Export all notes as JSON'}
	>
		{#if isExporting}
			<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		{:else}
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
			</svg>
		{/if}
		<span class="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
	</button>

	<button
		type="button"
		onclick={triggerImport}
		disabled={isImporting}
		class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
		title="Import notes from JSON file"
	>
		{#if isImporting}
			<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		{:else}
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
			</svg>
		{/if}
		<span class="hidden sm:inline">{isImporting ? 'Importing...' : 'Import'}</span>
	</button>

	<input
		bind:this={fileInput}
		type="file"
		accept=".json"
		onchange={handleFileSelect}
		class="hidden"
	/>
</div>

