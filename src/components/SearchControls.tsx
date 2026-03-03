import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { PAGE_SIZE_OPTIONS } from "../features/books/booksSlice";

interface SearchControlsProps {
  query: string;
  pageSize: number;
  onQueryChange: (nextQuery: string) => void;
  onPageSizeChange: (nextPageSize: number) => void;
}

export function SearchControls({
  query,
  pageSize,
  onQueryChange,
  onPageSizeChange
}: SearchControlsProps) {
  return (
    <Row className="g-3 align-items-end">
      <Col xs={12} md={8}>
        <Form.Label htmlFor="book-search">Search books</Form.Label>
        <Form.Control
          id="book-search"
          type="text"
          placeholder="Type a title, author, or keyword..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </Col>
      <Col xs={12} md={4}>
        <Form.Label htmlFor="page-size">Items per page</Form.Label>
        <Form.Select
          id="page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  );
}
