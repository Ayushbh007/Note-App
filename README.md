<!-- SHA-256 hash of GitHub username: f1bb3f8ea37fdb0dabe12b9cad0984d5eaf3e084173ae116e8a036cd3c2bbef4 -->

# Notes App

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

## Approach

I built this as an offline-first SvelteKit application with a focus on:
- **Component-based architecture**: Separated concerns into reusable components (NoteCard, NoteForm, NotesToolbar, etc.)
- **State management**: Used Svelte stores for reactive state with IndexedDB for offline persistence
- **Optimistic UI**: Immediate feedback with background synchronization
- **Progressive enhancement**: Works offline, syncs when online

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
