import type { Note, PendingOperation } from '../types';
import { api } from '../api';

const DB_NAME = 'notes-app-db';
const DB_VERSION = 1;
const STORE_NAME = 'notes';
const PENDING_STORE_NAME = 'pending-operations';

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		if (dbInstance) {
			resolve(dbInstance);
			return;
		}

		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			dbInstance = request.result;
			resolve(dbInstance);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'id' });
			}

			if (!db.objectStoreNames.contains(PENDING_STORE_NAME)) {
				db.createObjectStore(PENDING_STORE_NAME, { keyPath: 'timestamp' });
			}
		};
	});
}

export async function saveNotesToDB(notes: Note[]): Promise<void> {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, 'readwrite');
	const store = tx.objectStore(STORE_NAME);

	// Wait for all put operations to complete
	await Promise.all(
		notes.map(
			(note) =>
				new Promise<void>((resolve, reject) => {
					const clonedNote = JSON.parse(JSON.stringify(note));
					const request = store.put(clonedNote);
					request.onsuccess = () => resolve();
					request.onerror = () => reject(request.error);
				})
		)
	);
}

export async function getNotesFromDB(): Promise<Note[]> {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, 'readonly');
	const store = tx.objectStore(STORE_NAME);

	return new Promise((resolve, reject) => {
		const request = store.getAll();
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function savePendingOperation(operation: PendingOperation): Promise<void> {
	const db = await openDB();
	const tx = db.transaction(PENDING_STORE_NAME, 'readwrite');
	const store = tx.objectStore(PENDING_STORE_NAME);

	await new Promise<void>((resolve, reject) => {
		const request = store.put(operation);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export async function getPendingOperations(): Promise<PendingOperation[]> {
	const db = await openDB();
	const tx = db.transaction(PENDING_STORE_NAME, 'readonly');
	const store = tx.objectStore(PENDING_STORE_NAME);

	return new Promise((resolve, reject) => {
		const request = store.getAll();
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function removePendingOperation(timestamp: number): Promise<void> {
	const db = await openDB();
	const tx = db.transaction(PENDING_STORE_NAME, 'readwrite');
	const store = tx.objectStore(PENDING_STORE_NAME);

	await new Promise<void>((resolve, reject) => {
		const request = store.delete(timestamp);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export async function syncPendingOperations(): Promise<void> {
	if (!navigator.onLine) {
		return;
	}

	const pending = await getPendingOperations();

	for (const operation of pending) {
		try {
			switch (operation.type) {
				case 'create': {
					await api.createNote({
						title: operation.note.title,
						content: operation.note.content,
						pinned: operation.note.pinned
					});
					break;
				}
				case 'update': {
					await api.updateNote(operation.note.id, {
						title: operation.note.title,
						content: operation.note.content,
						pinned: operation.note.pinned
					});
					break;
				}
				case 'delete': {
					await api.deleteNote(operation.note.id);
					break;
				}
			}
			await removePendingOperation(operation.timestamp);
		} catch (error) {
			console.error('Failed to sync operation:', error);
			// Leave the operation in the pending store to retry later
		}
	}
}

