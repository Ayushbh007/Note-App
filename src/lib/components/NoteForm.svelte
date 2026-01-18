<script lang="ts">
  import type { Note } from "../types";
  import RichTextEditor from "./RichTextEditor.svelte";

  interface Props {
    note?: Note;
    onSubmit: (note: Omit<Note, "id" | "createdAt">) => void | Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
    saveTrigger?: number;
  }

  let { note, onSubmit, onCancel, isSubmitting = false, saveTrigger }: Props = $props();

  // Local form state
  let title = $state("");
  let content = $state("");
  let pinned = $state(false);

  let errors = $state<{ title?: string; content?: string }>({});

  let lastNoteId: string | undefined;
  let lastSaveTrigger = 0;

  $effect(() => {
    if (!note) {
      lastNoteId = undefined;
      title = "";
      content = "";
      pinned = false;
      return;
    }

    if (note.id === lastNoteId) return;

    lastNoteId = note.id;
    title = note.title;
    content = note.content;
    pinned = note.pinned ?? false;
  });

  $effect(() => {
    if (saveTrigger && saveTrigger > lastSaveTrigger) {
      lastSaveTrigger = saveTrigger;
      handleSubmit();
    }
  });

  function validate(): boolean {
    errors = {};

    if (!title.trim()) {
      errors.title = "Title is required";
    } else if (title.length > 100) {
      errors.title = "Title must be 100 characters or less";
    }

    if (!content.trim()) {
      errors.content = "Content is required";
    } else if (content.length > 2000) {
      errors.content = "Content must be 2000 characters or less";
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (isSubmitting || !validate()) return;

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        pinned,
      });
    } catch (error) {
      console.error("Failed to submit note:", error);
    }
  }
</script>

<form
  onsubmit={async (e) => {
    e.preventDefault();
    await handleSubmit();
  }}
  class="space-y-4"
>
  <div>
    <label
      for="title"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Title <span class="text-red-500">*</span>
    </label>
    <input
      id="title"
      type="text"
      bind:value={title}
      maxlength="100"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      class:border-red-500={errors.title}
      disabled={isSubmitting}
    />
    {#if errors.title}
      <p class="mt-1 text-sm text-red-500">{errors.title}</p>
    {/if}
  </div>

  <div>
    <label
      for="content"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Content <span class="text-red-500">*</span>
    </label>
    <RichTextEditor
      value={content}
      onInput={(val) => (content = val)}
      placeholder="Write your note content here..."
      disabled={isSubmitting}
      maxLength={2000}
    />
    {#if errors.content}
      <p class="mt-1 text-sm text-red-500">{errors.content}</p>
    {/if}
    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {content.length}/2000
    </p>
  </div>

  <div class="flex items-center">
    <input
      id="pinned"
      type="checkbox"
      bind:checked={pinned}
      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
      disabled={isSubmitting}
    />
    <label
      for="pinned"
      class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Pin this note
    </label>
  </div>

  <div class="flex gap-2 pt-2">
    <button
      type="submit"
      disabled={isSubmitting}
      class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Saving..." : note ? "Update" : "Create"}
    </button>
    <button
      type="button"
      onclick={onCancel}
      disabled={isSubmitting}
      class="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Cancel
    </button>
  </div>
</form>
