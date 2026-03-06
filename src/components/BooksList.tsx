import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { BookItem } from "../features/books/types";
import { BookCard } from "./BookCard";

interface BooksListProps {
  items: BookItem[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

export function BooksList({ items, status, error }: BooksListProps) {
  if (status === "loading" && items.length === 0) {
    return (
      <div className="py-5 text-center">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (status === "error" && items.length === 0) {
    return (
      <Alert variant="danger" className="mt-3">
        {error ?? "Something went wrong while loading books."}
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Alert variant="light" className="mt-3 border">
        No results found.
      </Alert>
    );
  }

  return (
    <>
      {status === "error" && items.length > 0 ? (
        <Alert variant="warning" className="mt-2 mb-2">
          {error ?? "Could not refresh right now. Showing previous results."}
        </Alert>
      ) : null}
      {status === "loading" && items.length > 0 ? (
        <div className="d-flex align-items-center gap-2 text-muted small mt-2">
          <Spinner animation="border" size="sm" role="status" />
          Refreshing results...
        </div>
      ) : null}
      <Row className="g-3 mt-1">
        {items.map((book) => (
          <Col key={book.id} xs={12}>
            <BookCard book={book} />
          </Col>
        ))}
      </Row>
    </>
  );
}
