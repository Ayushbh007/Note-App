# 🧪 Frontend Internship Take-Home Challenge

## 🧠 Goal

Build a simple web application using **Svelte** and **TailwindCSS** that interacts with a mock API. The app should allow users to **view**, **create**, **update** and **delete** "notes". The design is entirely up to you.

---

## 📄 Feature Requirements

1. **Display Notes**  
   - On page load, fetch and display a list of notes from `GET /notes`.  
   - Each note has:  
     ```json
     {
       "id": 30,
       "title": "Water Bottle",
       "content": "It hydrates you and keeps you healthy",
       "createdAt": "2025-06-03T11:38:28.192Z"
     }
     ```

2. **Create Note**  
   - Provide a form with `title` and `content` fields.  
   - On submit, send `POST /notes` with a JSON body and update the list.

3. **Edit Note**  
   - Each note should have an "Edit" button.  
   - Clicking it allows the user to edit the fields inline or in a modal.  
   - On save, send `PUT /notes/:id`.
  
4. **Delete Note**  
   - Each note should have a "Delete" button.  
   - Clicking it allows the user to delete the note. 
   - On delete, send `DELETE /notes/:id`.

---

## ✨ Additional UX + Code Challenges

We expect you to implement the following (not optional):

### 🧑‍🎨 UX & UI
- App should be fully responsive — optimize layout for both mobile and desktop using TailwindCSS
- You must include a custom 404 page if the user navigates to an unknown route
- Sort notes by title, createdAt, or ID (default: newest first)
- Implement a confirmation modal for deleting notes
- Soft deletes with undo. Deleted notes should persist for 10 seconds with an option to revert the deletion. We recommend a toast but design is up to you
- Implement pagination, limiting the view to 20 notes per page, or infinite scroll
- Implement a search box, allowing the user to filter notes by title
- Implement dark mode using Tailwind's class strategy, with a button to toggle between light and dark
- Custom 404 page for unknown routes
- Confirmation modal before deleting a note
- All forms should include validation (required fields, max length)
- A link to your GitHub repository in the footer of the page
- Debounced search — searches should be debounced (e.g., 300–500ms) to  improve perceived performance
- Keyboard shortcuts — add helpful shortcuts (example: Ctrl+N = new note, Esc = close modal) to speed up power-user workflows
- Offline sync — the app must work while offline: store notes and pending changes locally and automatically sync with the API when the client regains connectivity. Show sync status in the UI.

Empty states for:
- No notes
- Search with no results

### ⚙️ Async + Data

- Use loading spinners or indicators on all async operations
- Implement optimistic UI for create/edit/delete
- Implement pagination (bonus points for infinite scroll) - 20 notes per page
- Loading skeletons when fetching notes

### 🛠 Code Quality

- All notes and form components should be in separate files
- Create a reusable API wrapper module
- Use TypeScript with no implicit `any`
- Ensure all dependencies are on latest stable versions
- Add a linter to your project

### 💡 Add Your Own Feature (Required)

Think of one additional feature, implement it, and describe why you chose it in the README. It can be functional (e.g. pinning notes), visual (e.g. animations), or architectural (e.g. localStorage sync, theming system, test setup).

---

## 🧰 Tech Requirements

- Use **TypeScript**
- Use **Svelte** for UI components
- Use **TailwindCSS** for styling
- Use the **Fetch API** for HTTP requests

Make sure that **all** dependencies are on the **latest** version.

---

## 🧪 API

You **must** use [https://mockapi.io](https://mockapi.io) with this setup:

![image](https://i.imgur.com/7I2gxP6.png)

Note that mockAPI has built-in support for filtering and pagination, which you are expected to use.

---

## 📦 What to Submit

- A link to a GitHub repo with your code (email to engineering@inlabels.in)
- A short video link (1–3 minutes) explaining the project and showcasing the features you have implemented
- A short README including:
  - A SHA-256 hash of your GitHub username in the **first line** of the README
  - A link to your deployed app, in GitHub Pages, Vercel, Netlify, or similar
  - How to run and deploy the app
  - A short reflection on how you approached the assignment
  - Any trade-offs or assumptions you made
  - Any additional dependencies you added, and the reason why
  - What you'd do with more time
