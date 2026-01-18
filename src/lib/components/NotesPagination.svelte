<script lang="ts">
  import {
    currentPage,
    handlePreviousPage,
    handleNextPage,
  } from "$lib/notes/pagination";

  interface Props {
    totalPages: number;
  }

  let { totalPages }: Props = $props();
</script>

{#if totalPages > 1}
  <div class="mt-8 flex items-center justify-center gap-4">
    <button
      onclick={handlePreviousPage}
      disabled={$currentPage === 1}
      class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      Previous
    </button>
    <span class="text-gray-600 dark:text-gray-400">
      Page {$currentPage}
    </span>
    <button
      onclick={() => handleNextPage(totalPages)}
      disabled={$currentPage >= totalPages}
      class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      Next
    </button>
  </div>
{/if}
