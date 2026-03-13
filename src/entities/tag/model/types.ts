export interface TagListItemDTO {
  id: number;
  name: string;
  code: string;
  sort: number;
  updatedAt: string;
  createdAt: string;
}

export interface TagDetailDTO {
  id: number;
  name: string;
  code: string;
  sort: number;
  updatedAt: string;
  createdAt: string;
}

export interface EditTagRequestDTO {
  code?: string;
  name?: string;
  sort?: number;
}
