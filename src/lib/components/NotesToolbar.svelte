<script lang="ts">
	import { searchQuery, debouncedSearchFn } from '$lib/notes/search';
	import { handleSortChange, sortBy, sortOrder } from '$lib/notes/sort';

	interface Props {
		onCreate: () => void;
	}

	let { onCreate }: Props = $props();
</script>

<div class="mb-8 space-y-4">
	<div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
		<div class="flex-1 max-w-lg w-full sm:w-[420px]">
			<input
				type="text"
				placeholder="Search notes by title..."
				bind:value={$searchQuery}
				oninput={(e) => debouncedSearchFn((e.target as HTMLInputElement).value)}
				class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-lg shadow-slate-200/50 dark:shadow-black/20 focus:ring-2 focus:ring-emerald-400 dark:focus:ring-lime-300 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-200 transition"
			/>
		</div>
		<button
			onclick={onCreate}
			class="px-5 py-3 rounded-xl font-semibold text-white dark:text-slate-900 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-lime-300 dark:via-emerald-300 dark:to-cyan-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition"
		>
			+ New Note
		</button>
	</div>
	<div class="flex flex-wrap gap-2 items-center text-sm">
		<span class="text-slate-600 dark:text-teal-100">Sort by:</span>
		<button
			onclick={() => handleSortChange('createdAt')}
			class="px-3 py-1.5 rounded-lg border {$sortBy === 'createdAt'
				? 'bg-emerald-500 dark:bg-emerald-300 text-white dark:text-slate-900 border-transparent'
				: 'bg-white dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:border-emerald-400 dark:hover:border-emerald-200/60'} transition"
		>
			Date {$sortBy === 'createdAt' ? ($sortOrder === 'asc' ? '↑' : '↓') : ''}
		</button>
		<button
			onclick={() => handleSortChange('title')}
			class="px-3 py-1.5 rounded-lg border {$sortBy === 'title'
				? 'bg-emerald-500 dark:bg-emerald-300 text-white dark:text-slate-900 border-transparent'
				: 'bg-white dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:border-emerald-400 dark:hover:border-emerald-200/60'} transition"
		>
			Title {$sortBy === 'title' ? ($sortOrder === 'asc' ? '↑' : '↓') : ''}
		</button>
		<button
			onclick={() => handleSortChange('id')}
			class="px-3 py-1.5 rounded-lg border {$sortBy === 'id'
				? 'bg-emerald-500 dark:bg-emerald-300 text-white dark:text-slate-900 border-transparent'
				: 'bg-white dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:border-emerald-400 dark:hover:border-emerald-200/60'} transition"
		>
			ID {$sortBy === 'id' ? ($sortOrder === 'asc' ? '↑' : '↓') : ''}
		</button>
	</div>
</div>