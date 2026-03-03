export interface GoogleBooksListResponse {
  totalItems: number;
  items?: BookItem[];
}

export interface BookItem {
  id: string;
  volumeInfo: VolumeInfo;
}

export interface VolumeInfo {
  title?: string;
  subtitle?: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  infoLink?: string;
  publisher?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
}

export interface SearchParams {
  query: string;
  page: number;
  pageSize: number;
}
