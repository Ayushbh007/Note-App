type ShortcutOptions = {
  onNew: () => void;
  onCloseModals: () => void;
  onSave?: () => void;
  isModalOpen: () => boolean;
};

function isTypingInInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  const isContentEditable = target.isContentEditable;
  return (
    ["input", "textarea", "select", "option", "button"].includes(tag) ||
    isContentEditable
  );
}

/**
 * Registers global keyboard shortcuts for the app.
 * - Alt/Option + N or Ctrl/Cmd + Shift + N: open new note
 * - Ctrl/Cmd + Shift + S: save note (when modal is open)
 * - Esc: close modals (when any modal is open)
 * Returns a cleanup function to remove listeners.
 */
export function registerShortcuts({
  onNew,
  onCloseModals,
  onSave,
  isModalOpen,
}: ShortcutOptions): () => void {
  function handleKeydown(event: KeyboardEvent) {
    // New note shortcuts that avoid the browser's Ctrl/Cmd+N new-tab:
    // - Alt + N
    // - Ctrl/Cmd + Shift + N
    const key = event.key.toLowerCase();
    const newNoteCombo =
      (key === "n" && event.altKey) ||
      (key === "n" && (event.ctrlKey || event.metaKey) && event.shiftKey);

    if (newNoteCombo) {
      if (isTypingInInput(event.target)) return;
      event.preventDefault();
      onNew();
      return;
    }

    // Save note shortcut
    if (key === "s" && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      event.preventDefault();
      onSave?.();
      return;
    }

    // Esc should work even when focus is inside inputs/buttons
    if (event.key === "Escape" && isModalOpen()) {
      event.preventDefault();
      onCloseModals();
    }
  }

  window.addEventListener("keydown", handleKeydown);
  return () => window.removeEventListener("keydown", handleKeydown);
}
