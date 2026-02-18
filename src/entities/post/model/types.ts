export interface Media {
  id: number;
  name: string;
  url: string;
}

export interface Author {
  id: number;
  fullName: string;
  avatar?: Media | null;
}

export interface Tag {
  id: number;
  name: string;
  code?: string;
}

export interface Post {
  id: number;
  title: string;
  body?: string;
  userId?: number;
  code?: string;
  text?: string;
  previewPicture?: Media | null;
  author?: Author | null;
  tags?: Tag[];
  updatedAt?: string;
  createdAt?: string;
  authorName?: string;
  tagNames?: string[];
}

export interface Pagination {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}
