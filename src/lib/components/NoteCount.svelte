<script lang="ts">
  import { notes } from "$lib/notes/notes.store";
  import { debouncedSearch } from "$lib/notes/search";

  interface Props {
    displayedCount: number;
  }

  let { displayedCount }: Props = $props();

  let total = $derived($notes.length);

  let filteredCount = $derived(
    $debouncedSearch
      ? $notes.filter((n) =>
          n.title.toLowerCase().includes($debouncedSearch.toLowerCase()),
        ).length
      : total,
  );

  let isFiltered = $derived(!!$debouncedSearch);
</script>

{#if total > 0}
  <div class="mb-4 text-sm text-slate-500 dark:text-teal-100/70">
    {#if isFiltered}
      Showing {displayedCount} of {filteredCount} notes
      <span class="text-slate-400 dark:text-teal-100/50"
        >(filtered from {total})</span
      >
    {:else}
      Showing {displayedCount} of {total} notes
    {/if}
  </div>
{/if}
