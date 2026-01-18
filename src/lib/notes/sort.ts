import { writable, get } from "svelte/store";
import type { Note, SortOption, SortOrder } from "$lib/types";

// Default sorting
export const sortBy = writable<SortOption>("createdAt");
export const sortOrder = writable<SortOrder>("desc");

// Handle sort change from UI
export function handleSortChange(option: SortOption) {
  if (get(sortBy) === option) {
    sortOrder.update((o) => (o === "asc" ? "desc" : "asc"));
  } else {
    sortBy.set(option);
    sortOrder.set("desc");
  }
}

// Sort notes with pinned always on top
export function sortNotes(
  notes: Note[],
  sortBy: SortOption,
  sortOrder: SortOrder,
): Note[] {
  const pinned = notes.filter((note) => note.pinned);
  const unpinned = notes.filter((note) => !note.pinned);

  const sortFn = (a: Note, b: Note) => {
    let comparison = 0;

    switch (sortBy) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;

      case "createdAt":
        comparison =
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime();
        break;

      case "id":
        comparison = a.id.localeCompare(b.id);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  };

  return [
    ...pinned.sort(sortFn),
    ...unpinned.sort(sortFn),
  ];
}
