<script lang="ts">
  import type { Note } from "$lib/types";
  import Modal from "$lib/components/Modal.svelte";
  import NoteForm from "$lib/components/NoteForm.svelte";

  interface Props {
    showCreate: boolean;
    editingNote: Note | null;
    deletingNote: Note | null;
    isSubmitting: boolean;
    saveTrigger: number;
    onCreate: (data: Omit<Note, "id" | "createdAt">) => void;
    onUpdate: (data: Omit<Note, "id" | "createdAt">) => void;
    onDeleteConfirm: () => void;
    onCloseModals: () => void;
  }

  let {
    showCreate,
    editingNote,
    deletingNote,
    isSubmitting,
    saveTrigger,
    onCreate,
    onUpdate,
    onDeleteConfirm,
    onCloseModals,
  }: Props = $props();
</script>

<Modal
  isOpen={showCreate || editingNote !== null}
  onClose={onCloseModals}
  title={editingNote ? "Edit Note" : "Create Note"}
>
  <NoteForm
    note={editingNote || undefined}
    onSubmit={editingNote ? onUpdate : onCreate}
    onCancel={onCloseModals}
    {isSubmitting}
    {saveTrigger}
  />
</Modal>

<Modal
  isOpen={deletingNote !== null}
  onClose={onCloseModals}
  title="Delete Note"
  size="sm"
>
  <div class="space-y-4">
    <p class="text-gray-700 dark:text-gray-300">
      Are you sure you want to delete "{deletingNote?.title}"? This action
      cannot be undone.
    </p>
    <div class="flex gap-2">
      <button
        onclick={onDeleteConfirm}
        class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
      >
        Delete
      </button>
      <button
        onclick={onCloseModals}
        class="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>
