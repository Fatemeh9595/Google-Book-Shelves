import { useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Stack from "react-bootstrap/Stack";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearSelectedBook, loadBookDetail } from "../features/books/booksSlice";

export function BookDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { selectedBook, selectedBookStatus, selectedBookError } = useAppSelector((state) => state.books);

  useEffect(() => {
    if (!id) {
      return;
    }
    dispatch(loadBookDetail(id));
    return () => {
      dispatch(clearSelectedBook());
    };
  }, [dispatch, id]);

  if (!id) {
    return <Alert variant="warning">Missing book id.</Alert>;
  }

  if (selectedBookStatus === "loading") {
    return (
      <div className="py-5 text-center">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (selectedBookStatus === "error") {
    return <Alert variant="danger">{selectedBookError ?? "Could not load this book."}</Alert>;
  }

  if (!selectedBook) {
    return null;
  }

  const info = selectedBook.volumeInfo;
  const thumbnail = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;

  return (
    <Stack gap={3}>
      <Link to="/" className="btn btn-outline-secondary align-self-start">
        Back to search
      </Link>

      <Card className="shadow-sm">
        <Card.Body className="d-flex flex-column flex-md-row gap-4">
          {thumbnail && <img src={thumbnail} alt={info.title ?? "Book cover"} className="detail-thumb rounded" />}
          <div className="flex-grow-1">
            <h2 className="h4 mb-1">{info.title ?? "Untitled"}</h2>
            {info.subtitle && <p className="text-muted mb-2">{info.subtitle}</p>}
            <p className="mb-2">
              <strong>Author(s): </strong>
              {(info.authors ?? ["Unknown author"]).join(", ")}
            </p>
            <p className="mb-2">
              <strong>Published: </strong>
              {info.publishedDate ?? "N/A"}
            </p>
            {info.publisher && (
              <p className="mb-2">
                <strong>Publisher: </strong>
                {info.publisher}
              </p>
            )}
            {info.categories && info.categories.length > 0 && (
              <div className="mb-2 d-flex gap-2 flex-wrap">
                {info.categories.map((category) => (
                  <Badge key={category} bg="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
            <p className="mb-3">{info.description ?? "No description available."}</p>
            {info.infoLink && (
              <Button href={info.infoLink} target="_blank" rel="noreferrer" variant="primary">
                Open on Google Books
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Stack>
  );
}
