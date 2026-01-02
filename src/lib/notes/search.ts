import { writable, get } from 'svelte/store';
import { debounce } from '$lib/utils/debounce';

export const searchQuery = writable('');
export const debouncedSearch = writable('');
export const isSearching = writable(false);

// Track if there's a pending search
let pendingSearch = false;

export const debouncedSearchFn = debounce((query: string) => {
	debouncedSearch.set(query);
	isSearching.set(false);
	pendingSearch = false;
}, 400);

// Call this when user starts typing to show loading state
export function startSearch(query: string) {
	const currentDebounced = get(debouncedSearch);
	// Only show loading if the query will change
	if (query !== currentDebounced) {
		isSearching.set(true);
		pendingSearch = true;
	}
	debouncedSearchFn(query);
}