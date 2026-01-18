export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  pinned?: boolean;
}

export type SortOption = "createdAt" | "title" | "id";
export type SortOrder = "asc" | "desc";

export interface NotesResponse {
  data: Note[];
  total: number;
}

export interface PendingOperation {
  type: "create" | "update" | "delete";
  note: Note;
  timestamp: number;
}
