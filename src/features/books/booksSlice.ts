import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchBookById, fetchBooks } from "./booksApi";
import { BookItem } from "./types";

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const;

interface BooksState {
  query: string;
  page: number;
  pageSize: (typeof PAGE_SIZE_OPTIONS)[number];
  items: BookItem[];
  totalItems: number;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  selectedBook: BookItem | null;
  selectedBookStatus: "idle" | "loading" | "success" | "error";
  selectedBookError: string | null;
}

const initialState: BooksState = {
  query: "react",
  page: 1,
  pageSize: 10,
  items: [],
  totalItems: 0,
  status: "idle",
  error: null,
  selectedBook: null,
  selectedBookStatus: "idle",
  selectedBookError: null
};

export const loadBooks = createAsyncThunk(
  "books/loadBooks",
  async (_, thunkApi) => {
    const state = thunkApi.getState() as { books: BooksState };
    return fetchBooks({
      query: state.books.query,
      page: state.books.page,
      pageSize: state.books.pageSize
    });
  }
);

export const loadBookDetail = createAsyncThunk("books/loadBookDetail", async (id: string) =>
  fetchBookById(id)
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.page = 1;
    },
    clearResults(state) {
      state.items = [];
      state.totalItems = 0;
      state.status = "idle";
      state.error = null;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<(typeof PAGE_SIZE_OPTIONS)[number]>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    clearSelectedBook(state) {
      state.selectedBook = null;
      state.selectedBookStatus = "idle";
      state.selectedBookError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadBooks.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload.items ?? [];
        state.totalItems = action.payload.totalItems ?? 0;
      })
      .addCase(loadBooks.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "Unknown error";
        state.items = [];
        state.totalItems = 0;
      })
      .addCase(loadBookDetail.pending, (state) => {
        state.selectedBookStatus = "loading";
        state.selectedBookError = null;
      })
      .addCase(loadBookDetail.fulfilled, (state, action) => {
        state.selectedBookStatus = "success";
        state.selectedBook = action.payload;
      })
      .addCase(loadBookDetail.rejected, (state, action) => {
        state.selectedBookStatus = "error";
        state.selectedBookError = action.error.message ?? "Unknown error";
      });
  }
});

export const { setQuery, clearResults, setPage, setPageSize, clearSelectedBook } = booksSlice.actions;
export { PAGE_SIZE_OPTIONS };
export default booksSlice.reducer;
