# Notes App

A modern, offline-first notes application built with SvelteKit, featuring real-time synchronization, search, sorting, and pagination capabilities.

## Overview

This application allows users to create, manage, and organize personal notes with a clean, responsive interface. It supports offline functionality, ensuring notes are accessible even without an internet connection, and automatically syncs changes when connectivity is restored.

## Features

- **Create, Edit, Delete Notes**: Full CRUD operations with optimistic UI updates
- **Pin Important Notes**: Mark notes as pinned for quick access
- **Search Functionality**: Real-time search through note titles
- **Sorting Options**: Sort notes by creation date, title, or ID in ascending/descending order
- **Pagination**: Efficiently navigate through large collections of notes
- **Offline Support**: Works seamlessly offline with automatic synchronization
- **Dark Mode**: Toggle between light and dark themes
- **Keyboard Shortcuts**: Quick actions for power users
- **Responsive Design**: Optimized for desktop and mobile devices
- **Toast Notifications**: User feedback with undo capabilities for deletions

## Architecture

### Frontend Framework
- **SvelteKit**: Modern web framework for building fast, efficient applications
- **TypeScript**: Type-safe development with enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

### State Management
- **Svelte Stores**: Reactive state management for notes, loading states, and UI interactions
- **IndexedDB**: Client-side database for offline data persistence
- **Optimistic Updates**: Immediate UI feedback with background synchronization

### Backend Integration
- **MockAPI**: RESTful API for data persistence and synchronization
- **Fetch API**: HTTP client with timeout and error handling
- **Pending Operations Queue**: Handles offline mutations and syncs them when online

### Key Components
- **NotesList**: Displays paginated, filtered, and sorted notes
- **NoteForm**: Modal form for creating and editing notes
- **NotesToolbar**: Search input and create note button
- **NotesPagination**: Page navigation controls
- **NotesModals**: Centralized modal management for CRUD operations

### Utilities
- **Offline Sync**: Manages pending operations and data synchronization
- **Search**: Debounced search functionality
- **Sort**: Flexible sorting by multiple criteria
- **Pagination**: Client-side pagination logic
- **Dark Mode**: Theme switching with local storage persistence
- **Shortcuts**: Keyboard shortcut registration and handling

## Workflow

### Online Workflow
1. **Load Notes**: Application fetches notes from MockAPI on startup
2. **Create Note**: User fills form → Optimistic UI update → API call → Persist to local DB
3. **Edit Note**: User modifies note → Optimistic update → API call → Sync local DB
4. **Delete Note**: User confirms deletion → 10-second undo window → Permanent deletion → API call
5. **Pin Note**: Toggle pin status → Immediate UI update → API call
6. **Search/Sort/Page**: Client-side filtering and pagination of loaded notes

### Offline Workflow
1. **Load Notes**: Application loads from IndexedDB cache
2. **Create/Edit/Delete/Pin**: Operations stored as pending → UI updates optimistically → Persisted locally
3. **Reconnection**: When online, pending operations sync to API → Local DB updated → UI refreshed

### Synchronization Process
- **Online Event**: Triggers sync of pending operations → Refreshes notes from API
- **Background Sync**: Automatic reconciliation of local and remote data
- **Conflict Resolution**: Last-write-wins strategy for concurrent modifications

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd takehome
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (optional):
Create a `.env` file in the root directory:
```
VITE_MOCKAPI_PROJECT_ID=your_mockapi_project_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── lib/
│   ├── api.ts                 # API client for MockAPI integration
│   ├── types.ts               # TypeScript type definitions
│   ├── components/            # Reusable UI components
│   │   ├── NoteCard.svelte
│   │   ├── NoteForm.svelte
│   │   ├── NotesList.svelte
│   │   ├── NotesModals.svelte
│   │   ├── NotesToolbar.svelte
│   │   ├── NotesPagination.svelte
│   │   └── ...
│   ├── notes/                 # Notes-specific logic
│   │   ├── notes.store.ts     # State management for notes
│   │   ├── search.ts          # Search functionality
│   │   ├── sort.ts            # Sorting logic
│   │   └── pagination.ts      # Pagination utilities
│   ├── stores/                # Global state stores
│   │   └── sync-status.ts     # Online/offline status
│   └── utils/                 # Utility functions
│       ├── offline-sync.ts    # Offline synchronization
│       ├── dark-mode.ts       # Theme management
│       ├── shortcuts.ts       # Keyboard shortcuts
│       └── debounce.ts        # Debounce utility
├── routes/
│   ├── +page.svelte           # Main application page
│   └── +layout.svelte         # Application layout
└── app.html                   # HTML template
```

## API Integration

The application integrates with MockAPI for data persistence. Key endpoints:

- `GET /notes` - Fetch paginated notes with optional search and sorting
- `GET /notes/:id` - Fetch a single note
- `POST /notes` - Create a new note
- `PUT /notes/:id` - Update an existing note
- `DELETE /notes/:id` - Delete a note

## Offline Capabilities

- **Local Storage**: Notes cached in IndexedDB for offline access
- **Pending Operations**: CRUD operations queued when offline
- **Automatic Sync**: Pending operations sync when connection restored
- **Optimistic UI**: Immediate feedback for all user actions

## Keyboard Shortcuts

- `Ctrl/Cmd + N`: Create new note
- `Escape`: Close modals

## Technologies Used

- **SvelteKit**: Web framework
- **TypeScript**: Programming language
- **Tailwind CSS**: Styling framework
- **IndexedDB**: Client-side database
- **MockAPI**: Backend API service
- **Vite**: Build tool and dev server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting: `npm run check`
5. Submit a pull request

## License

This project is licensed under the MIT License.
