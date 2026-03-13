export interface MediaDTO {
  id: number;
  name: string;
  url: string;
}

export interface AuthorListItemDTO {
  id: number;
  name: string;
  lastName: string;
  secondName: string;
  avatar?: MediaDTO | null;
  updatedAt: string;
  createdAt: string;
}

export interface AuthorDetailDTO {
  id: number;
  name: string;
  lastName: string;
  secondName: string;
  shortDescription: string;
  description: string;
  avatar?: MediaDTO | null;
  updatedAt: string;
  createdAt: string;
}

export interface EditAuthorRequestDTO {
  name?: string;
  lastName?: string;
  secondName?: string;
  shortDescription?: string;
  description?: string;
  avatar?: File | null;
  removeAvatar?: string | boolean;
}

export interface PaginationDTO {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}
