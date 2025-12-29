import type { Note, NotesResponse } from './types';

/**
 * MockAPI base URL
 * Set VITE_MOCKAPI_PROJECT_ID in .env
 */
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

/**
 * Handle fetch responses
 */
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
	timeout = 10000 // 10 second timeout
): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		console.log('[DEBUG] fetchWithTimeout before fetch', url, options, timeout);
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});
		console.log('[DEBUG] fetchWithTimeout after fetch', response);
		return response;
	} catch (error) {
		console.error('[DEBUG] fetchWithTimeout error', error);
		if (error instanceof Error && error.name === 'AbortError') {
			throw new ApiError(408, 'Request timeout');
		}
		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
}

export const api = {
	/**
	 * Get paginated notes
	 */
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

		// MockAPI filtering works by field name
		if (search) {
			url.searchParams.set('title', search);
		}

		const response = await fetchWithTimeout(url.toString());
		const data = await handleResponse<Note[]>(response);

		return {
			data,
			// MockAPI does not return total count → estimate
			total: data.length === limit ? page * limit + 1 : page * limit
		};
	},

	/**
	 * Get single note
	 */
	async getNote(id: string): Promise<Note> {
		const response = await fetchWithTimeout(
			`${getBaseUrl()}/notes/${id}`
		);
		const note = await handleResponse<Note>(response);
		return { ...note, id: String(note.id) };
	},

	/**
	 * Create note
	 * IMPORTANT:
	 * - Do NOT send createdAt
	 * - Do NOT send id
	 */
	async createNote(
		note: Omit<Note, 'id' | 'createdAt'>
	): Promise<Note> {
		console.log('[DEBUG] api.createNote called', note);
		const body = {
			title: note.title,
			content: note.content,
			pinned: note.pinned ?? false
		};

		let response;
		try {
			console.log('[DEBUG] api.createNote before fetchWithTimeout', body);
			response = await fetchWithTimeout(
				`${getBaseUrl()}/notes`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(body)
				}
			);
			console.log('[DEBUG] api.createNote after fetchWithTimeout', response);
			const result = await handleResponse<Note>(response);
			console.log('[DEBUG] api.createNote after handleResponse', result);
			return result;
		} catch (error) {
			console.error('[DEBUG] api.createNote error', error, response);
			throw error;
		}
	},

	/**
	 * Update note
	 */
	async updateNote(
		id: string,
		note: Partial<Omit<Note, 'id'>>
	): Promise<Note> {
		const response = await fetchWithTimeout(
			`${getBaseUrl()}/notes/${id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(note)
			}
		);

		return handleResponse<Note>(response);
	},

	/**
	 * Delete note
	 */
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
