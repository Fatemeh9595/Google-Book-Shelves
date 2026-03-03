import { useEffect } from "react";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { BooksList } from "../components/BooksList";
import { Paginator } from "../components/Paginator";
import { SearchControls } from "../components/SearchControls";
import { clearResults, loadBooks, setPage, setPageSize, setQuery } from "../features/books/booksSlice";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export function SearchPage() {
  const dispatch = useAppDispatch();
  const { query, page, pageSize, items, totalItems, status, error } = useAppSelector((state) => state.books);
  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      dispatch(clearResults());
      return;
    }
    dispatch(loadBooks());
  }, [dispatch, debouncedQuery, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <Stack gap={3}>
      <Card className="shadow-sm">
        <Card.Body>
          <SearchControls
            query={query}
            pageSize={pageSize}
            onQueryChange={(nextQuery) => dispatch(setQuery(nextQuery))}
            onPageSizeChange={(nextPageSize) => dispatch(setPageSize(nextPageSize as 5 | 10 | 15 | 20))}
          />
        </Card.Body>
      </Card>

      <BooksList items={items} status={status} error={error} />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="small text-muted">
          Showing page {page} of {totalPages} ({totalItems} total results)
        </div>
        <Paginator page={page} totalPages={totalPages} onPageChange={(nextPage) => dispatch(setPage(nextPage))} />
      </div>
    </Stack>
  );
}
