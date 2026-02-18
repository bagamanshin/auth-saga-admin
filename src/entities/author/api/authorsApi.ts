import { request } from '@shared/api';
import type { AuthorListItem, AuthorDetail } from '../model/types';

export const getAuthorsApi = () => {
  return request<undefined, AuthorListItem[]>(`/manage/authors`);
};

export const getAuthorDetailApi = (id: number) => {
  const params = new URLSearchParams({ id: id.toString() });
  return request<undefined, AuthorDetail>(`/manage/authors/detail?${params.toString()}`);
};

export interface EditAuthorRequest {
  name?: string;
  lastName?: string;
  secondName?: string;
  shortDescription?: string;
  description?: string;
  avatar?: File | null;
  removeAvatar?: string | boolean;
}

export type EditAuthorErrorResponse = {
  name: string;
  message: string;
  code: number;
  status: number;
  type: string;
};

export type EditAuthorValidationErrorResponse = {
  field: string;
  message: string;
}[];

export type EditAuthorRequestError = EditAuthorErrorResponse | EditAuthorValidationErrorResponse;

export const editAuthorApi = (id: number, authorData: EditAuthorRequest) => {
  const params = new URLSearchParams({ id: id.toString() });
  return request<EditAuthorRequest, boolean, EditAuthorRequestError>(`/manage/authors/edit?${params.toString()}`, {
    method: 'POST',
    body: authorData,
    isFormData: true,
  });
};

export const removeAuthorApi = (id: number) => {
  const params = new URLSearchParams({ id: id.toString() });
  return request<undefined, boolean>(`/manage/authors/remove?${params.toString()}`, {
    method: 'DELETE',
  });
};

export const addAuthorApi = (authorData: EditAuthorRequest) => {
  return request<EditAuthorRequest, boolean, EditAuthorRequestError>(`/manage/authors/add`, {
    method: 'POST',
    body: authorData,
    isFormData: true,
  });
};
