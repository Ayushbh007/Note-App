<script lang="ts">
	import type { Note } from '$lib/types';
	import NoteCard from '$lib/components/NoteCard.svelte';

	interface Props {
		notes: Note[];
		onEdit: (note: Note) => void;
		onDelete: (note: Note) => void;
		onPin: (note: Note) => void;
	}

	let { notes, onEdit, onDelete, onPin }: Props = $props();
</script>

{#if notes.length === 0}
	<div class="text-center py-12">
		<p class="text-gray-500 dark:text-gray-400 text-lg">No notes yet. Create your first note!</p>
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each notes as note (note.id)}
			<NoteCard {note} onEdit={onEdit} onDelete={onDelete} onPin={onPin} />
		{/each}
	</div>
{/if}