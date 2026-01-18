import { writable, get, derived } from "svelte/store";
import type { Note, SortOption } from "$lib/types";
import { api } from "$lib/api";
import { sortNotes } from "./sort";
import { sortBy, sortOrder } from "./sort";
import {
  saveNotesToDB,
  getNotesFromDB,
  savePendingOperation,
} from "$lib/utils/offline-sync";

export const notes = writable<Note[]>([]);
export const totalNotes = writable(0);
export const isLoading = writable(false);
export const isSubmitting = writable(false);

export const visibleNotes = derived([notes, sortBy, sortOrder], ([$notes, $sortBy, $sortOrder]) => {
  return sortNotes($notes, $sortBy, $sortOrder);
});

export async function loadNotes(
  page = 1,
  limit = 20,
  search = "",
  sortBy: SortOption = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  isLoading.set(true);
  try {
    if (navigator.onLine) {
      const response = await api.getNotes(page, limit, search, sortBy, sortOrder);
      notes.set(response.data);
      totalNotes.set(response.total);
    } else {
      const data = await getNotesFromDB();
      const filtered = data.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase())
      );
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);
      notes.set(paginated);
      totalNotes.set(filtered.length);
    }
  } catch (error) {
    console.error("Failed to load notes:", error);
    notes.set([]);
  } finally {
    isLoading.set(false);
  }
}

export async function createNote(data: Omit<Note, "id" | "createdAt">) {
  try {
    isSubmitting.set(true);
    const tempId = Date.now().toString();
    const newNote: Note = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
    };
    notes.update((n) => [newNote, ...n]);
    await performCreate(tempId, data);
  } finally {
    isSubmitting.set(false);
  }
}

async function performCreate(
  tempId: string,
  data: Omit<Note, "id" | "createdAt">,
) {
  try {
    if (navigator.onLine) {
      const created = await api.createNote(data);
      notes.update((n) => {
        const withoutTemp = n.filter((note) => note.id !== tempId);
        return [created, ...withoutTemp];
      });
      saveNotesToDB(get(notes)).catch(console.error);
    } else {
      await savePendingOperation({
        type: "create",
        note: { ...data, id: tempId, createdAt: new Date().toISOString() },
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    notes.update((n) => n.filter((note) => note.id !== tempId));
    throw error;
  }
  saveNotesToDB(get(notes)).catch(console.error);
}

export function updateNote(id: string, data: Partial<Omit<Note, "id">>) {
  const currentNotes = get(notes);
  const noteToEdit = currentNotes.find((n) => n.id === id);
  if (!noteToEdit) return;
  const originalNote = { ...noteToEdit };
  notes.update((n) =>
    n.map((note) => (note.id === id ? { ...note, ...data } : note)),
  );
  const performUpdate = async () => {
    try {
      if (navigator.onLine) {
        const updated = await api.updateNote(id, data);
        notes.update((n) => n.map((note) => (note.id === id ? updated : note)));
        saveNotesToDB(get(notes)).catch(console.error);
      } else {
        await savePendingOperation({
          type: "update",
          note: { ...noteToEdit, ...data },
          timestamp: Date.now(),
        });
        saveNotesToDB(get(notes)).catch(console.error);
      }
    } catch (error) {
      console.error("Failed to update note:", error);
      notes.update((n) =>
        n.map((note) => (note.id === id ? originalNote : note)),
      );
    }
  };
  performUpdate().catch(console.error);
}

export function deleteNote(id: string) {
  const currentNotes = get(notes);
  const noteToDelete = currentNotes.find((n) => n.id === id);
  if (!noteToDelete) return;
  notes.update((n) => n.filter((note) => note.id !== id));
  const performDelete = async () => {
    try {
      if (navigator.onLine) {
        await api.deleteNote(id);
        saveNotesToDB(get(notes)).catch(console.error);
      } else {
        await savePendingOperation({
          type: "delete",
          note: noteToDelete,
          timestamp: Date.now(),
        });
        saveNotesToDB(get(notes)).catch(console.error);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      notes.update((n) => [...n, noteToDelete]);
    }
  };
  performDelete().catch(console.error);
}

export function pinNote(id: string) {
  const currentNotes = get(notes);
  const note = currentNotes.find((n) => n.id === id);
  if (!note) return;

  const updatedNote = { ...note, pinned: !note.pinned };

  notes.update((n) => n.map((n) => (n.id === id ? updatedNote : n)));

  if (navigator.onLine) {
    api
      .updateNote(id, { pinned: updatedNote.pinned })
      .then(() => {
        saveNotesToDB(get(notes)).catch(console.error);
      })
      .catch((error) => {
        console.error("Failed to pin note:", error);
        notes.update((n) => n.map((n) => (n.id === id ? note : n)));
      });
  } else {
    savePendingOperation({
      type: "update",
      note: updatedNote,
      timestamp: Date.now(),
    })
      .then(() => {
        saveNotesToDB(get(notes)).catch(console.error);
      })
      .catch((error) => {
        console.error("Failed to save pending pin operation:", error);
        notes.update((n) => n.map((n) => (n.id === id ? note : n)));
      });
  }
}
