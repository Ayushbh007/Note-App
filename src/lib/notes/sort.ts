import { writable, get } from 'svelte/store';
import type { Note } from '$lib/types';

export type SortOption = 'createdAt' | 'title' | 'id';
export type SortOrder = 'asc' | 'desc';

export const sortBy = writable<SortOption>('createdAt');
export const sortOrder = writable<SortOrder>('desc');

export function handleSortChange(option: SortOption) {
	if (get(sortBy) === option) {
		sortOrder.update(o => o === 'asc' ? 'desc' : 'asc');
	} else {
		sortBy.set(option);
		sortOrder.set('desc');
	}
}

export function sortNotes(notes: Note[], sortBy: SortOption, sortOrder: SortOrder): Note[] {
	return [...notes].sort((a, b) => {
		let comparison = 0;
		switch (sortBy) {
			case 'title':
				comparison = a.title.localeCompare(b.title);
				break;
			case 'createdAt':
				comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				break;
			case 'id':
				comparison = a.id.localeCompare(b.id);
				break;
		}
		return sortOrder === 'asc' ? comparison : -comparison;
	});
}