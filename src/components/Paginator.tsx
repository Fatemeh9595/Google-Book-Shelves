import Pagination from "react-bootstrap/Pagination";

interface PaginatorProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

function buildVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
}

export function Paginator({ page, totalPages, onPageChange }: PaginatorProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = buildVisiblePages(page, totalPages);

  return (
    <Pagination className="mb-0 flex-wrap">
      <Pagination.First onClick={() => onPageChange(1)} disabled={page === 1} />
      <Pagination.Prev onClick={() => onPageChange(page - 1)} disabled={page === 1} />
      {visiblePages.map((pageNumber, index) => {
        const prevPage = visiblePages[index - 1];
        const needsEllipsis = prevPage !== undefined && pageNumber - prevPage > 1;
        return (
          <span key={pageNumber} className="d-flex">
            {needsEllipsis && <Pagination.Ellipsis disabled />}
            <Pagination.Item active={pageNumber === page} onClick={() => onPageChange(pageNumber)}>
              {pageNumber}
            </Pagination.Item>
          </span>
        );
      })}
      <Pagination.Next onClick={() => onPageChange(page + 1)} disabled={page === totalPages} />
      <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={page === totalPages} />
    </Pagination>
  );
}
