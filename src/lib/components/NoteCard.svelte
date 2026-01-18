<script lang="ts">
  import { fly } from "svelte/transition";
  import type { Note } from "../types";

  interface Props {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
    onPin: (note: Note) => void;
  }

  let { note, onEdit, onDelete, onPin }: Props = $props();

  function formatDate(dateStr: string | undefined): string | null {
    if (!dateStr) return null;

    const isValidISODate = /^\d{4}-\d{2}-\d{2}/.test(dateStr);

    if (!isValidISODate) {
      return null;
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  }

  function wasUpdated(): boolean {
    if (!note.updatedAt || !note.createdAt) return false;
    return note.updatedAt !== note.createdAt;
  }
</script>

<div
  class="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f3c46]/90 shadow-xl shadow-slate-200/50 dark:shadow-black/30 p-5 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20 transition"
  transition:fly={{ y: 12, duration: 160, opacity: 0 }}
>
  <div class="flex items-start justify-between mb-3">
    <div class="flex-1">
      <div class="flex items-center gap-2">
        {#if note.pinned}
          <span
            class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 dark:bg-lime-300 text-white dark:text-slate-900 font-bold shadow"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
            </svg>
          </span>
        {/if}
        <h3 class="text-xl font-bold text-slate-800 dark:text-white">
          {note.title}
        </h3>
      </div>
      <div
        class="text-sm text-slate-500 dark:text-teal-100/80 mt-1 space-y-0.5"
      >
        <p>Created: {formatDate(note.createdAt) ?? "Date unavailable"}</p>
        {#if wasUpdated() && formatDate(note.updatedAt)}
          <p class="text-xs text-slate-400 dark:text-teal-100/60">
            Updated: {formatDate(note.updatedAt)}
          </p>
        {/if}
      </div>
    </div>
    <button
      onclick={() => onPin(note)}
      class="p-2 rounded-full border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/10 hover:border-emerald-400 dark:hover:border-lime-300 hover:text-emerald-600 dark:hover:text-lime-200 transition"
      aria-label={note.pinned ? "Unpin note" : "Pin note"}
    >
      <svg
        class="w-5 h-5 {note.pinned
          ? 'text-emerald-500 dark:text-lime-300'
          : 'text-slate-400 dark:text-slate-300'}"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
      </svg>
    </button>
  </div>
  <p
    class="text-slate-600 dark:text-slate-100 mb-5 whitespace-pre-wrap break-words leading-relaxed"
  >
    {note.content}
  </p>
  <div class="flex gap-2">
    <button
      onclick={() => onEdit(note)}
      class="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-lime-400 dark:from-teal-300 dark:via-emerald-300 dark:to-lime-300 text-white dark:text-slate-900 font-bold shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition"
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
