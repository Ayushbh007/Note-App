<script lang="ts">
	interface Props {
		isOpen: boolean;
		onClose: () => void;
		title: string;
		children: import('svelte').Snippet;
		size?: 'sm' | 'md' | 'lg';
	}

	let { isOpen, onClose, title, children, size = 'md' }: Props = $props();

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			onClose();
		}
	}
</script>

{#if isOpen}
	<div
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		class="fixed inset-0 z-50 overflow-y-auto"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		tabindex="-1"
	>
		<div class="flex min-h-screen items-center justify-center p-4">
			<div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-[fadeIn_150ms_ease]"></div>
			<div
				class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md {size === 'lg'
					? 'max-w-2xl'
					: size === 'sm'
						? 'max-w-sm'
						: 'max-w-md'} p-6 animate-[scaleIn_170ms_ease]"
			>
				<div class="flex items-center justify-between mb-4">
					<h2 id="modal-title" class="text-xl font-semibold text-gray-900 dark:text-white">
						{title}
					</h2>
					<button
						onclick={onClose}
						class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
						aria-label="Close modal"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div class="text-gray-700 dark:text-gray-300">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>


