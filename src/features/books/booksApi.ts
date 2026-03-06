import { BookItem, GoogleBooksListResponse, SearchParams } from "./types";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 2;
const INITIAL_RETRY_DELAY_MS = 300;

type GoogleApiErrorResponse = {
  error?: {
    code?: number;
    message?: string;
    errors?: Array<{ reason?: string; message?: string }>;
  };
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchWithRetry(url: string): Promise<Response> {
  let response = await fetch(url);

  for (let attempt = 1; attempt <= MAX_RETRIES && RETRYABLE_STATUS.has(response.status); attempt += 1) {
    const delay = INITIAL_RETRY_DELAY_MS * 2 ** (attempt - 1);
    await sleep(delay);
    response = await fetch(url);
  }

  return response;
}

async function buildError(prefix: string, response: Response): Promise<Error> {
  let details = "";
  try {
    const data = (await response.json()) as GoogleApiErrorResponse;
    const apiReason = data.error?.errors?.[0]?.reason;
    const apiMessage = data.error?.message;
    if (apiReason || apiMessage) {
      details = `: ${apiReason ?? apiMessage}`;
    }
  } catch {
    // Ignore non-JSON error bodies.
  }

  return new Error(`${prefix} (${response.status})${details}`);
}

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

  const response = await fetchWithRetry(url.toString());
  if (!response.ok) {
    throw await buildError("Unable to fetch books", response);
  }

  return response.json() as Promise<GoogleBooksListResponse>;
}

export async function fetchBookById(id: string): Promise<BookItem> {
  const url = new URL(`${BASE_URL}/${id}`);
  if (API_KEY) {
    url.searchParams.set("key", API_KEY);
  }

  const response = await fetchWithRetry(url.toString());
  if (!response.ok) {
    throw await buildError("Unable to fetch book detail", response);
  }
  return response.json() as Promise<BookItem>;
}
