import { writable, get } from "svelte/store";
import { debounce } from "$lib/utils/debounce";

export const searchQuery = writable("");
export const debouncedSearch = writable("");
export const isSearching = writable(false);

export const debouncedSearchFn = debounce((query: string) => {
  debouncedSearch.set(query);
  isSearching.set(false);
}, 400);

export function startSearch(query: string) {
  const currentDebounced = get(debouncedSearch);
  if (query !== currentDebounced) {
    isSearching.set(true);
  }
  debouncedSearchFn(query);
}
