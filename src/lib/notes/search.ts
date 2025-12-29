import { writable } from 'svelte/store';
import { debounce } from '$lib/utils/debounce';

export const searchQuery = writable('');
export const debouncedSearch = writable('');

export const debouncedSearchFn = debounce((query: string) => {
	debouncedSearch.set(query);
}, 400);