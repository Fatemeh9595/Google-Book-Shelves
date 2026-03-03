# Google Books Search SPA

Responsive single-page app built with React + TypeScript + Redux Toolkit + Bootstrap 5.

## Features

- Live search (request updates at every typed character)
- Pagination using API params (`startIndex`, `maxResults`)
- Dynamic page count from `totalItems`
- Page size selector with allowed values: `5`, `10`, `15`, `20`
- List view with 2-line truncated description (`...`)
- Detail page with book information + `infoLink`
- Responsive layout for mobile and desktop
- Sass theme customization

## Run

```bash
npm install
npm run dev
```

Optional but recommended for better quota handling:

1. Create `.env` from `.env.example`
2. Put your Google API key in `VITE_GOOGLE_BOOKS_API_KEY`

## Build

```bash
npm run build
```

## API

- Search: `https://www.googleapis.com/books/v1/volumes?q={search terms}`
- Detail: `https://www.googleapis.com/books/v1/volumes/{id}`
- Optional key param: `&key=YOUR_API_KEY`

## Publish

1. Push this project to a GitHub repository.
2. Import that GitHub repo into CodeSandbox to host it.
