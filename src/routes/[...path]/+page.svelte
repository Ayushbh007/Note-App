<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '$lib/utils/dark-mode';

	onMount(() => {
		theme.init();
	});
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
	<div class="text-center">
		<h1 class="text-9xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
		<h2 class="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
		<p class="text-gray-600 dark:text-gray-400 mb-8">
			The page you're looking for doesn't exist or has been moved.
		</p>
		<a
			href="/"
			class="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
		>
			Go Home
		</a>
	</div>
</div>

