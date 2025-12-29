<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Note } from '../types';

	interface Props {
		note: Note;
		onEdit: (note: Note) => void;
		onDelete: (note: Note) => void;
		onPin: (note: Note) => void;
	}

	let { note, onEdit, onDelete, onPin }: Props = $props();
</script>

<div
	class="rounded-2xl border border-white/10 bg-[#0f3c46]/90 shadow-xl shadow-black/30 p-5 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20 transition"
	transition:fly={{ y: 12, duration: 160, opacity: 0 }}
>
	<div class="flex items-start justify-between mb-3">
		<div class="flex-1">
			<div class="flex items-center gap-2">
				{#if note.pinned}
					<span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-lime-300 text-slate-900 font-bold shadow">
						<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
						</svg>
					</span>
				{/if}
				<h3 class="text-xl font-bold text-white">{note.title}</h3>
			</div>
			<p class="text-sm text-teal-100/80 mt-1">
				{new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString()}
			</p>
		</div>
		<button
			onclick={() => onPin(note)}
			class="p-2 rounded-full border border-white/15 bg-white/10 hover:border-lime-300 hover:text-lime-200 transition"
			aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
		>
			<svg
				class="w-5 h-5 {note.pinned ? 'text-lime-300' : 'text-slate-300'}"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
			</svg>
		</button>
	</div>
	<p class="text-slate-100 mb-5 whitespace-pre-wrap break-words leading-relaxed">{note.content}</p>
	<div class="flex gap-2">
		<button
			onclick={() => onEdit(note)}
			class="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-300 via-emerald-300 to-lime-300 text-slate-900 font-bold shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition"
		>
			Edit
		</button>
		<button
			onclick={() => onDelete(note)}
			class="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold shadow-lg shadow-rose-500/30 hover:-translate-y-0.5 transition"
		>
			Delete
		</button>
	</div>
</div>

