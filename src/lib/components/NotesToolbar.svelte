<script lang="ts">
  import { searchQuery, startSearch, isSearching } from "$lib/notes/search";
  import { handleSortChange, sortBy, sortOrder } from "$lib/notes/sort";
  import ExportImport from "./ExportImport.svelte";

  interface Props {
    onCreate: () => void;
    onToast?: (message: string, type: "success" | "error" | "info") => void;
  }

  let { onCreate, onToast }: Props = $props();
</script>

<div class="mb-8 space-y-4">
  <div
    class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
  >
    <div class="flex-1 max-w-lg w-full sm:w-[420px] relative">
      <input
        type="text"
        placeholder="Search notes by title..."
        bind:value={$searchQuery}
        oninput={(e) => startSearch((e.target as HTMLInputElement).value)}
        class="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-lg shadow-slate-200/50 dark:shadow-black/20 focus:ring-2 focus:ring-emerald-400 dark:focus:ring-lime-300 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-200 transition"
      />
      {#if $isSearching}
        <div class="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            class="w-5 h-5 text-emerald-500 dark:text-lime-300 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      {/if}
    </div>
    <div class="flex gap-3 items-center">
      <ExportImport
        onSuccess={(msg) => onToast?.(msg, "success")}
        onError={(msg) => onToast?.(msg, "error")}
      />
      <button
        onclick={onCreate}
        class="px-5 py-3 rounded-xl font-semibold text-white dark:text-slate-900 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-lime-300 dark:via-emerald-300 dark:to-cyan-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition"
      >
        + New Note
      </button>
    </div>
  </div>
  <div class="flex flex-wrap gap-2 items-center text-sm">
    <span class="text-slate-600 dark:text-teal-100">Sort by:</span>
    <button
      onclick={() => handleSortChange("createdAt")}
      class="px-3 py-1.5 rounded-lg border {$sortBy === 'createdAt'
        ? 'bg-emerald-500 dark:bg-emerald-300 text-white dark:text-slate-900 border-transparent'
        : 'bg-white dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:border-emerald-400 dark:hover:border-emerald-200/60'} transition"
    >
      Date {$sortBy === "createdAt" ? ($sortOrder === "asc" ? "↑" : "↓") : ""}
    </button>
    <button
      onclick={() => handleSortChange("title")}
      class="px-3 py-1.5 rounded-lg border {$sortBy === 'title'
        ? 'bg-emerald-500 dark:bg-emerald-300 text-white dark:text-slate-900 border-transparent'
        : 'bg-white dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:border-emerald-400 dark:hover:border-emerald-200/60'} transition"
    >
      Title {$sortBy === "title" ? ($sortOrder === "asc" ? "↑" : "↓") : ""}
    </button>
    <button
      onclick={() => handleSortChange("id")}
      class="px-3 py-1.5 rounded-lg border {$sortBy === 'id'
        ? 'bg-emerald-500 dark:bg-emerald-300 text-white dark:text-slate-900 border-transparent'
        : 'bg-white dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:border-emerald-400 dark:hover:border-emerald-200/60'} transition"
    >
      ID {$sortBy === "id" ? ($sortOrder === "asc" ? "↑" : "↓") : ""}
    </button>
  </div>
</div>
