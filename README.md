SHA-256 hash of GitHub username: f1bb3f8ea37fdb0dabe12b9cad0984d5eaf3e084173ae116e8a036cd3c2bbef4



# Notes App

A modern, offline-first note-taking application built with SvelteKit, featuring real-time synchronization, rich text editing, and keyboard shortcuts.

## Features

- **Offline-First**: Works seamlessly without internet connection, with automatic sync when online
- **Rich Text Editor**: Create and edit notes with formatting support
- **Pinning**: Pin important notes to keep them at the top
- **Search**: Find notes quickly by title
- **Sorting**: Sort notes by date, title, or ID with ascending/descending order
- **Pagination**: Efficiently browse through large collections of notes
- **Keyboard Shortcuts**: Boost productivity with customizable shortcuts
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Real-time Sync**: Changes sync across devices when online

## Technologies Used

- **Frontend**: SvelteKit, Svelte 5, TypeScript
- **Styling**: Tailwind CSS
- **Backend API**: MockAPI (for demo purposes)
- **Offline Storage**: IndexedDB
- **Build Tool**: Vite
- **Linting**: ESLint with Prettier
- **Icons**: Custom SVG icons

## Deployed App

https://github.com/Ayushbh007/Note-App#

## How to Run and Deploy

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Deploy

The app can be deployed to Vercel, Netlify, or GitHub Pages. For Vercel/Netlify, connect your repository and deploy. For GitHub Pages, use the `npm run build` output in the `build` directory.

## Architecture

The application follows a modern, component-based architecture built with SvelteKit:

### Frontend Architecture
- **Component-based**: Modular, reusable components for UI elements
- **Store-based State Management**: Svelte stores for reactive state management
- **Derived Stores**: Computed values for sorted and filtered data
- **Event-driven Updates**: Reactive updates triggered by user interactions

### Data Flow
1. User interactions trigger store updates
2. Derived stores automatically re-compute sorted/filtered data
3. UI components react to store changes
4. API calls sync data when online
5. Offline operations queue for later sync

### Key Design Patterns
- **Offline-First**: Core functionality works without network
- **Optimistic Updates**: Immediate UI feedback with background sync
- **Progressive Enhancement**: Graceful degradation and enhancement
- **Separation of Concerns**: Clear boundaries between UI, logic, and data

## API Integration

The app integrates with MockAPI for demonstration purposes:

- **RESTful Endpoints**: Standard CRUD operations for notes
- **Pagination Support**: Server-side pagination with configurable limits
- **Search & Filtering**: Title-based search with sorting options
- **Error Handling**: Comprehensive error handling with user feedback

## Offline Support

Built with offline-first principles:

- **IndexedDB Storage**: Client-side database for offline data
- **Pending Operations**: Queue system for offline actions
- **Automatic Sync**: Background synchronization when connection restored
- **Conflict Resolution**: Basic last-write-wins strategy
- **Network Detection**: Real-time online/offline status monitoring

## Project Structure

The project follows a standard SvelteKit structure with additional organization for notes-specific logic.

```
takehome/
├── .eslintrc.cjs          # ESLint configuration
├── .gitignore             # Git ignore rules
├── .npmrc                 # NPM configuration
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Lockfile for dependencies
├── README.md              # This file
├── svelte.config.js       # SvelteKit configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── src/
│   ├── app.css            # Global styles
│   ├── app.d.ts           # TypeScript declarations
│   ├── app.html           # Main HTML template
│   ├── lib/
│   │   ├── api.ts         # API utilities
│   │   ├── index.ts       # Library exports
│   │   ├── types.ts       # Type definitions
│   │   ├── assets/
│   │   │   └── favicon.svg # Favicon
│   │   ├── components/    # Reusable Svelte components
│   │   │   ├── ExportImport.svelte
│   │   │   ├── LoadingSkeleton.svelte
│   │   │   ├── Modal.svelte
│   │   │   ├── Navbar.svelte
│   │   │   ├── NoteCard.svelte
│   │   │   ├── NoteCount.svelte
│   │   │   ├── NoteForm.svelte
│   │   │   ├── NotesList.svelte
│   │   │   ├── NotesModals.svelte
│   │   │   ├── NotesPagination.svelte
│   │   │   ├── NotesToolbar.svelte
│   │   │   ├── RichTextEditor.svelte
│   │   │   └── Toast.svelte
│   │   ├── notes/         # Notes-specific logic
│   │   │   ├── notes.store.ts  # Notes store
│   │   │   ├── pagination.ts   # Pagination logic
│   │   │   ├── search.ts        # Search functionality
│   │   │   └── sort.ts          # Sorting logic
│   │   ├── stores/       # Additional stores
│   │   │   └── sync-status.ts   # Sync status store
│   │   └── utils/        # Utility functions
│   │       ├── dark-mode.ts     # Dark mode utilities
│   │       ├── debounce.ts      # Debounce utility
│   │       ├── offline-sync.ts  # Offline sync utilities
│   │       └── shortcuts.ts     # Keyboard shortcuts
│   └── routes/           # SvelteKit routes
│       ├── +error.svelte # Error page
│       ├── +layout.svelte # Layout component
│       ├── +page.svelte   # Main page
│       └── [...path]/    # Catch-all route
│           └── +page.svelte
└── static/
    └── robots.txt        # Robots.txt for SEO
```

For deployment, the app can be automatically deployed to Vercel or Netlify on push to main branch.

To set up:

1. Add a `.github/workflows/ci.yml` file with the following content:

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type check
        run: npm run check
      - name: Build
        run: npm run build
```

2. For deployment, configure your hosting platform to deploy on push to main.

## Keyboard Shortcuts

The application supports the following keyboard shortcuts:

### Windows/Linux
- **New Note**: `Alt + N` or `Ctrl + Shift + N`
- **Save Note**: `Ctrl + Shift + S`
- **Close Modals**: `Esc`

### Mac
- **New Note**: `Option + N` or `Cmd + Shift + N`
- **Save Note**: `Cmd + Shift + S`
- **Close Modals**: `Esc`

These shortcuts are designed to avoid conflicts with browser default behaviors.

## Trade-offs and Assumptions

- **MockAPI limitations**: Used client-side filtering/sorting since MockAPI has limited query capabilities
- **Last-write-wins**: No conflict resolution for concurrent edits (assumes single-user or accepts overwrites)
- **Plain text storage**: Rich text editor formats are converted to plain text for storage (HTML formatting not persisted)
- **10-second undo window**: Delete operations have a fixed undo period before permanent deletion

## Additional Dependencies

- **No additional dependencies**: Used only SvelteKit, TypeScript, and Tailwind CSS as provided
- All features implemented with native browser APIs (IndexedDB, Fetch API, etc.)

## What I'd Do With More Time

- Add markdown support for note content
- Implement real-time collaboration features
- Add note categories/tags for better organization
- Implement full-text search (searching content, not just titles)
- Add note templates
- Implement version history for notes
- Add drag-and-drop reordering
- Improve accessibility (ARIA labels, keyboard navigation)
- Add unit and integration tests
- Implement proper conflict resolution for concurrent edits