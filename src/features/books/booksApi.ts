import { BookItem, GoogleBooksListResponse, SearchParams } from "./types";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 4;
const INITIAL_RETRY_DELAY_MS = 300;
const CACHE_TTL_MS = 1000 * 60 * 30;

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
    const jitter = Math.floor(Math.random() * 200);
    const delay = INITIAL_RETRY_DELAY_MS * 2 ** (attempt - 1) + jitter;
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

type CacheEnvelope<T> = {
  createdAt: number;
  value: T;
};

function readCache<T>(key: string): T | null {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (!parsed || typeof parsed.createdAt !== "number") {
      return null;
    }
    if (Date.now() - parsed.createdAt > CACHE_TTL_MS) {
      window.localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T): void {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return;
  }

  const payload: CacheEnvelope<T> = {
    createdAt: Date.now(),
    value
  };
  try {
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignore storage quota and serialization issues.
  }
}

export async function fetchBooks(params: SearchParams): Promise<GoogleBooksListResponse> {
  const { query, page, pageSize } = params;
  const cacheKey = `books:list:${query.trim().toLowerCase()}:${page}:${pageSize}`;
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
    const cached = readCache<GoogleBooksListResponse>(cacheKey);
    if (cached) {
      return cached;
    }
    throw await buildError("Unable to fetch books", response);
  }

  const data = (await response.json()) as GoogleBooksListResponse;
  writeCache(cacheKey, data);
  return data;
}

export async function fetchBookById(id: string): Promise<BookItem> {
  const cacheKey = `books:detail:${id}`;
  const url = new URL(`${BASE_URL}/${id}`);
  if (API_KEY) {
    url.searchParams.set("key", API_KEY);
  }

  const response = await fetchWithRetry(url.toString());
  if (!response.ok) {
    const cached = readCache<BookItem>(cacheKey);
    if (cached) {
      return cached;
    }
    throw await buildError("Unable to fetch book detail", response);
  }
  const data = (await response.json()) as BookItem;
  writeCache(cacheKey, data);
  return data;
}
