import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { BookDetailPage } from "./pages/BookDetailPage";
import { SearchPage } from "./pages/SearchPage";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar bg="primary" variant="dark" expand="md" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">Google Books Explorer</Navbar.Brand>
        </Container>
      </Navbar>
      <main>
        <Container className="py-4 py-md-5">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </main>
    </div>
  );
}
