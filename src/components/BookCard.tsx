import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { BookItem } from "../features/books/types";

interface BookCardProps {
  book: BookItem;
}

export function BookCard({ book }: BookCardProps) {
  const { volumeInfo } = book;
  const thumbnail = volumeInfo.imageLinks?.thumbnail ?? volumeInfo.imageLinks?.smallThumbnail;

  return (
    <Card className="h-100 shadow-sm book-card">
      <Card.Body className="d-flex gap-3">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={volumeInfo.title ?? "Book cover"}
            className="book-thumb rounded"
            loading="lazy"
          />
        ) : (
          <div className="book-thumb rounded bg-light border d-flex align-items-center justify-content-center text-muted">
            No cover
          </div>
        )}
        <div className="d-flex flex-column flex-grow-1 min-w-0">
          <Card.Title className="mb-1">{volumeInfo.title ?? "Untitled"}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted small">
            {(volumeInfo.authors ?? ["Unknown author"]).join(", ")}
          </Card.Subtitle>
          <Card.Text className="text-truncate-2 small flex-grow-1">
            {volumeInfo.description ?? "No description available."}
          </Card.Text>
          <Button as={Link} to={`/book/${book.id}`} variant="outline-primary" size="sm" className="mt-2 align-self-start">
            View details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
