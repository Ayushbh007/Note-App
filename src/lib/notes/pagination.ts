import { writable, get } from 'svelte/store';
import type { Note } from '$lib/types';

export const currentPage = writable(1);
export const itemsPerPage = 20;

export function paginate(notes: Note[], currentPage: number): Note[] {
	const start = (currentPage - 1) * itemsPerPage;
	return notes.slice(start, start + itemsPerPage);
}

export function getTotalPages(total: number): number {
	return Math.ceil(total / itemsPerPage) || 1;
}

export function handlePageChange(page: number) {
	currentPage.set(page);
}

export function handlePreviousPage() {
	currentPage.update(p => Math.max(1, p - 1));
}

export function handleNextPage(totalPages: number) {
	currentPage.update(p => Math.min(totalPages, p + 1));
}