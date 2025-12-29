<script lang="ts">
	interface Props {
		message: string;
		type?: 'success' | 'error' | 'info';
		duration?: number;
		onClose: () => void;
		onUndo?: () => void;
	}

	let { message, type = 'info', duration = 3000, onClose, onUndo }: Props = $props();

// Use a plain variable so the effect doesn't retrigger when we set it
let timeoutId: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(onClose, duration);
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});

	const typeStyles = {
		success: 'bg-emerald-500/95 text-white border border-emerald-400/40 shadow-lg shadow-emerald-500/30',
		error: 'bg-rose-500/95 text-white border border-rose-400/40 shadow-lg shadow-rose-500/30',
		info: 'bg-indigo-500/95 text-white border border-indigo-400/40 shadow-lg shadow-indigo-500/30'
	};
</script>

<div
	class="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur {typeStyles[type]} animate-slide-up"
	role="alert"
>
	<div class="flex items-center gap-2 flex-1">
		<span class="w-2 h-2 rounded-full bg-white/80"></span>
		<p class="font-semibold">{message}</p>
	</div>
	{#if onUndo}
		<button
			onclick={onUndo}
			class="px-3 py-1.5 rounded-lg bg-white/90 text-slate-800 font-semibold shadow-sm hover:shadow transition"
		>
			Undo
		</button>
	{/if}
	<button
		onclick={onClose}
		class="text-white/80 hover:text-white rounded-lg p-1.5 transition"
		aria-label="Close"
	>
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</button>
</div>

<style>
	@keyframes slide-up {
		from {
			transform: translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-slide-up {
		animation: slide-up 0.3s ease-out;
	}
</style>


