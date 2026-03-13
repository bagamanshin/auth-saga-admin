export interface MediaDTO {
  id: number;
  name: string;
  url: string;
}

export interface AuthorDTO {
  id: number;
  fullName: string;
  avatar?: MediaDTO | null;
}

export interface TagDTO {
  id: number;
  name: string;
  code?: string;
}

export interface PostDTO {
  id: number;
  title: string;
  body?: string;
  userId?: number;
  code?: string;
  text?: string;
  previewPicture?: MediaDTO | null;
  author?: AuthorDTO | null;
  tags?: TagDTO[];
  updatedAt?: string;
  createdAt?: string;
  authorName?: string;
  tagNames?: string[];
}

export interface EditPostRequestDTO {
  code?: string;
  title?: string;
  authorId?: number;
  tagIds?: number[];
  text?: string;
  previewPicture?: File | null;
}

export interface PaginationDTO {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}
