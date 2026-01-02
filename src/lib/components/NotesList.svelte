<script lang="ts">
	import type { Note } from '$lib/types';
	import NoteCard from '$lib/components/NoteCard.svelte';

	interface Props {
		notes: Note[];
		onEdit: (note: Note) => void;
		onDelete: (note: Note) => void;
		onPin: (note: Note) => void;
		onCreate?: () => void;
	}

	let { notes, onEdit, onDelete, onPin, onCreate }: Props = $props();
</script>

{#if notes.length === 0}
	<div class="text-center py-12">
		<p class="text-gray-500 dark:text-gray-400 text-lg mb-6">No notes yet. Create your first note!</p>
		{#if onCreate}
			<button
				onclick={onCreate}
				class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-lime-400 dark:from-teal-300 dark:via-emerald-300 dark:to-lime-300 text-white dark:text-slate-900 font-bold shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-xl transition"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				Create Note
			</button>
		{/if}
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each notes as note (note.id)}
			<NoteCard {note} onEdit={onEdit} onDelete={onDelete} onPin={onPin} />
		{/each}
	</div>
{/if}