# Google Books Shelves Explorer

Welcome to **Google Books Shelves Explorer**, a modern web app built to deliver a clean and practical book-discovery experience.  
Search by keyword, browse paginated results, and open full book details with a responsive UI designed for desktop and mobile.

## What This Project Covers

This project is a complete frontend implementation powered by an external API data source.

- Responsive and visually clean interface for searching and browsing books
- Dynamic routing between list and detail pages
- Centralized state management for query, pagination, loading, and error states
- Resilient API handling with retries and local cache fallback for temporary outages

## Tech Stack

- **React 18** for component-based UI
- **TypeScript** for safer, typed development
- **Redux Toolkit + React-Redux** for global state management
- **React Router DOM** for client-side routing
- **Bootstrap 5 + React-Bootstrap** for layout and UI components
- **Sass** for styling customization
- **Vite** for fast development and production builds

## Frontend and Backend Architecture

### Frontend

- Built as a SPA (Single Page Application)
- Main pages:
  - Search and results page
  - Book detail page
- Includes:
  - Live search
  - Items-per-page selector
  - Pagination
  - Loading and error feedback
  - Responsive behavior across screen sizes

### Backend / Data Layer

- No custom backend server is included in this repository.
- The app consumes the **Google Books REST API** directly.
- API key support is configured through environment variables.

## API Endpoints

- Search books:  
  `GET https://www.googleapis.com/books/v1/volumes`
  - Query params:
    - `q` (search keyword)
    - `startIndex` (pagination offset)
    - `maxResults` (page size)
    - `key` (optional API key)

- Book details:  
  `GET https://www.googleapis.com/books/v1/volumes/{id}`
  - Query params:
    - `key` (optional API key)

## Key Features

- Live search experience
- Dynamic pagination based on `totalItems`
- Selectable page size (`5`, `10`, `15`, `20`)
- Truncated description preview in cards
- Dedicated detail page with metadata and Google Books link
- Retry strategy for transient API failures (`429`, `500`, `502`, `503`, `504`)
- Local cache fallback to reduce temporary service interruptions

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` (recommended):

```env
VITE_GOOGLE_BOOKS_API_KEY=your_api_key_here
```

3. Start development server:

```bash
npm run dev
```

## Production Build

```bash
npm run build
```
