export interface Media {
  id: number;
  name: string;
  url: string;
}

export interface AuthorListItem {
  id: number;
  name: string;
  lastName: string;
  secondName: string;
  avatar?: Media | null;
  updatedAt: string;
  createdAt: string;
}

export interface AuthorDetail {
  id: number;
  name: string;
  lastName: string;
  secondName: string;
  shortDescription: string;
  description: string;
  avatar?: Media | null;
  updatedAt: string;
  createdAt: string;
}

export interface Pagination {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}
