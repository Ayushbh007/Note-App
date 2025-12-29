<div class="space-y-4">
	{#each Array(3) as _}
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
			<div class="animate-pulse">
				<div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
				<div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
				<div class="space-y-2 mb-4">
					<div class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
					<div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
				</div>
				<div class="flex gap-2">
					<div class="h-10 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
					<div class="h-10 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
				</div>
			</div>
		</div>
	{/each}
</div>


