import { writable, get } from 'svelte/store';
import type { Note } from '$lib/types';
import { api } from '$lib/api';
import { saveNotesToDB, getNotesFromDB, savePendingOperation } from '$lib/utils/offline-sync';

export const notes = writable<Note[]>([]);
export const isLoading = writable(false);
export const isMutating = writable(false);
export const isSubmitting = writable(false);

export async function loadNotes() {
	isLoading.set(true);
	try {
		if (navigator.onLine) {
			const response = await api.getNotes(1, 1000, '', 'createdAt', 'desc');
			notes.set(response.data);
			saveNotesToDB(response.data).catch(console.error);
		} else {
			const data = await getNotesFromDB();
			notes.set(data);
		}
	} catch (error) {
		console.error('Failed to load notes:', error);
		notes.set([]);
	} finally {
		isLoading.set(false);
	}
}

export async function createNote(data: Omit<Note, 'id' | 'createdAt'>) {
	console.log('[DEBUG] createNote called', data);
	try {
		isSubmitting.set(true);
		const tempId = Date.now().toString();
		console.log('[DEBUG] createNote tempId', tempId);
		const newNote: Note = {
			...data,
			id: tempId,
			createdAt: new Date().toISOString()
		};
		console.log('[DEBUG] createNote newNote', newNote);
		notes.update(n => [newNote, ...n]);
		console.log('[DEBUG] createNote after notes.update');
		await performCreate(tempId, data);
		console.log('[DEBUG] createNote finished');
	} catch (err) {
		console.error('[DEBUG] createNote outer error', err);
		// Surface the error so callers (UI) can react appropriately
		throw err;
	} finally {
		isSubmitting.set(false);
	}
}

async function performCreate(tempId: string, data: Omit<Note, 'id' | 'createdAt'>) {
	try {
		console.log('[DEBUG] performCreate start, navigator.onLine:', navigator.onLine);
		if (navigator.onLine) {
			console.log('[DEBUG] performCreate before api.createNote');
			const created = await api.createNote(data);
			console.log('[DEBUG] performCreate after api.createNote', created);
			notes.update(n => {
				const withoutTemp = n.filter(note => note.id !== tempId);
				return [created, ...withoutTemp];
			});
			console.log('[DEBUG] createNote API success', created);
			saveNotesToDB(get(notes)).then(() => {
				console.log('[DEBUG] createNote after saveNotesToDB');
			}).catch(e => {
				console.error('[DEBUG] createNote saveNotesToDB error', e);
			});
		} else {
			console.log('[DEBUG] performCreate before savePendingOperation');
			await savePendingOperation({
				type: 'create',
				note: { ...data, id: tempId, createdAt: new Date().toISOString() },
				timestamp: Date.now()
			});
			console.log('[DEBUG] createNote offline, saved pending');
		}
	} catch (error) {
		console.error('[DEBUG] createNote error', error);
		notes.update(n => n.filter(note => note.id !== tempId));
		throw error;
	}
	// Persist current notes state locally so offline refresh keeps new note
	saveNotesToDB(get(notes)).catch(e => console.error('[DEBUG] createNote offline saveNotesToDB error', e));
	console.log('[DEBUG] performCreate finished');
}

export function updateNote(id: string, data: Partial<Omit<Note, 'id'>>) {
	console.log('[DEBUG] updateNote called', id, data);
	const currentNotes = get(notes);
	const noteToEdit = currentNotes.find(n => n.id === id);
	if (!noteToEdit) return;
	const originalNote = { ...noteToEdit };
	notes.update(n => n.map(note => note.id === id ? { ...note, ...data } : note));
	const performUpdate = async () => {
		try {
			if (navigator.onLine) {
				const updated = await api.updateNote(id, data);
				notes.update(n => n.map(note => note.id === id ? updated : note));
				console.log('[DEBUG] updateNote API success', updated);
				saveNotesToDB(get(notes)).catch(console.error);
			} else {
				await savePendingOperation({
					type: 'update',
					note: { ...noteToEdit, ...data },
					timestamp: Date.now()
				});
				console.log('[DEBUG] updateNote offline, saved pending');
				// Persist local changes for offline reloads
				saveNotesToDB(get(notes)).catch(console.error);
			}
		} catch (error) {
			console.error('[DEBUG] updateNote error', error);
			notes.update(n => n.map(note => note.id === id ? originalNote : note));
		}
	};
	performUpdate().catch(e => console.error('[DEBUG] updateNote performUpdate error', e));
}

export function deleteNote(id: string) {
	console.log('[DEBUG] deleteNote called', id);
	const currentNotes = get(notes);
	const noteToDelete = currentNotes.find(n => n.id === id);
	if (!noteToDelete) return;
	notes.update(n => n.filter(note => note.id !== id));
	const performDelete = async () => {
		try {
			if (navigator.onLine) {
				await api.deleteNote(id);
				console.log('[DEBUG] deleteNote API success', id);
				saveNotesToDB(get(notes)).catch(console.error);
			} else {
				await savePendingOperation({
					type: 'delete',
					note: noteToDelete,
					timestamp: Date.now()
				});
				console.log('[DEBUG] deleteNote offline, saved pending');
				// Persist local state without the deleted note
				saveNotesToDB(get(notes)).catch(console.error);
			}
		} catch (error) {
			console.error('[DEBUG] deleteNote error', error);
			notes.update(n => [...n, noteToDelete]);
		}
	};
	performDelete().catch(e => console.error('[DEBUG] deleteNote performDelete error', e));
}

export function pinNote(id: string) {
	const currentNotes = get(notes);
	const note = currentNotes.find(n => n.id === id);
	if (!note) return;

	const updatedNote = { ...note, pinned: !note.pinned };
	
	// Optimistic update
	notes.update(n => n.map(n => n.id === id ? updatedNote : n));
	
	if (navigator.onLine) {
		api.updateNote(id, { pinned: updatedNote.pinned }).then(() => {
			saveNotesToDB(get(notes)).catch(console.error);
		}).catch(error => {
			console.error('Failed to pin note:', error);
			notes.update(n => n.map(n => n.id === id ? note : n));
		});
	} else {
		savePendingOperation({
			type: 'update',
			note: updatedNote,
			timestamp: Date.now()
			}).then(() => {
				// Persist local pin state for offline reloads
				saveNotesToDB(get(notes)).catch(console.error);
			}).catch(error => {
			console.error('Failed to save pending pin operation:', error);
			notes.update(n => n.map(n => n.id === id ? note : n));
		});
	}
}