import { BookItem, GoogleBooksListResponse, SearchParams } from "./types";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

export async function fetchBooks(params: SearchParams): Promise<GoogleBooksListResponse> {
  const { query, page, pageSize } = params;
  const startIndex = (page - 1) * pageSize;
  const url = new URL(BASE_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("startIndex", String(startIndex));
  url.searchParams.set("maxResults", String(pageSize));
  if (API_KEY) {
    url.searchParams.set("key", API_KEY);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Unable to fetch books (${response.status})`);
  }

  return response.json() as Promise<GoogleBooksListResponse>;
}

export async function fetchBookById(id: string): Promise<BookItem> {
  const url = new URL(`${BASE_URL}/${id}`);
  if (API_KEY) {
    url.searchParams.set("key", API_KEY);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Unable to fetch book detail (${response.status})`);
  }
  return response.json() as Promise<BookItem>;
}
