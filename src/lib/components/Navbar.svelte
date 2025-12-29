<script lang="ts">
	import type { SyncStatus } from '$lib/stores/sync-status';
	import type { Readable } from 'svelte/store';

	interface Props {
		syncStatusStore: Readable<SyncStatus>;
		onToggleTheme: () => void;
		title?: string;
		subtitle?: string;
	}

	let { syncStatusStore, onToggleTheme, title = 'Notes App', subtitle = 'Notekeeper' }: Props = $props();
</script>

<header class="fixed inset-x-0 top-3 z-20 flex justify-center px-4">
	<div class="max-w-6xl w-full rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/40 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
		<div>
			<p class="text-xs uppercase tracking-[0.2em] text-teal-200">{subtitle}</p>
			<h1 class="text-3xl font-black text-white drop-shadow">{title}</h1>
		</div>
		<div class="flex items-center gap-3">
			<div class="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur shadow-lg">
				{#if $syncStatusStore === 'online'}
					<div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
					<span class="text-white">Online</span>
				{:else if $syncStatusStore === 'syncing'}
					<div class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
					<span class="text-white">Syncing...</span>
				{:else}
					<div class="w-2 h-2 bg-rose-400 rounded-full"></div>
					<span class="text-white">Offline</span>
				{/if}
			</div>
			<button
				onclick={onToggleTheme}
				class="p-2 rounded-full bg-white/10 border border-white/15 backdrop-blur shadow-lg hover:border-lime-300 hover:text-lime-200 transition"
				aria-label="Toggle dark mode"
			>
				<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707-.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</div>
</header>

