export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Pagination {
  page: number;
  size: number;
  total: number;
}
