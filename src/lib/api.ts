import type { Note, NotesResponse } from './types';

const getBaseUrl = (): string => {
	const projectId =
		import.meta.env.VITE_MOCKAPI_PROJECT_ID || '6950f91f70e1605a1088f854';

	return `https://${projectId}.mockapi.io`;
};

export class ApiError extends Error {
	constructor(public status: number, message: string) {
		super(message);
		this.name = 'ApiError';
	}
}

async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const text = await response.text();
		console.error('API Error - Status:', response.status, 'Response text:', text);
		throw new ApiError(
			response.status,
			text || `API error: ${response.statusText}`
		);
	}
	return response.json();
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
	url: string,
	options: RequestInit = {},
	timeout = 10000
): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});
		return response;
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			throw new ApiError(408, 'Request timeout');
		}
		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
}

export const api = {
	async getNotes(
		page = 1,
		limit = 20,
		search = '',
		sortBy = 'createdAt',
		order: 'asc' | 'desc' = 'desc'
	): Promise<NotesResponse> {
		const url = new URL(`${getBaseUrl()}/notes`);

		url.searchParams.set('page', String(page));
		url.searchParams.set('limit', String(limit));
		url.searchParams.set('sortBy', sortBy);
		url.searchParams.set('order', order);

		if (search) {
			url.searchParams.set('title', search);
		}

		const response = await fetchWithTimeout(url.toString());
		const data = await handleResponse<Note[]>(response);

		return {
			data,
			total: data.length === limit ? page * limit + 1 : page * limit
		};
	},

	async getNote(id: string): Promise<Note> {
		const response = await fetchWithTimeout(
			`${getBaseUrl()}/notes/${id}`
		);
		const note = await handleResponse<Note>(response);
		return { ...note, id: String(note.id) };
	},

	async createNote(
		note: Omit<Note, 'id' | 'createdAt'>
	): Promise<Note> {
		const now = new Date().toISOString();
		const body = {
			title: note.title,
			content: note.content,
			pinned: note.pinned ?? false,
			createdAt: now,
			updatedAt: now
		};

		const response = await fetchWithTimeout(
			`${getBaseUrl()}/notes`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			}
		);
		return handleResponse<Note>(response);
	},

	async updateNote(
		id: string,
		note: Partial<Omit<Note, 'id'>>
	): Promise<Note> {
		const body = {
			...note,
			updatedAt: new Date().toISOString()
		};

		const response = await fetchWithTimeout(
			`${getBaseUrl()}/notes/${id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			}
		);

		return handleResponse<Note>(response);
	},

	async deleteNote(id: string): Promise<void> {
		const response = await fetchWithTimeout(
			`${getBaseUrl()}/notes/${id}`,
			{
				method: 'DELETE'
			}
		);

		if (!response.ok) {
			throw new ApiError(
				response.status,
				`Failed to delete note`
			);
		}
	}
};
