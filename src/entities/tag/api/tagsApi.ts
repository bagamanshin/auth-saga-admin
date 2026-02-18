import { request } from '@shared/api';
import type { TagListItem, TagDetail } from '../model/types';

export const getTagsApi = () => {
  return request<undefined, TagListItem[]>(`/manage/tags`);
};

export const getTagDetailApi = (id: number) => {
  const params = new URLSearchParams({ id: id.toString() });
  return request<undefined, TagDetail>(`/manage/tags/detail?${params.toString()}`);
};

export interface EditTagRequest {
  code?: string;
  name?: string;
  sort?: number;
}

export type EditTagErrorResponse = {
  name: string;
  message: string;
  code: number;
  status: number;
  type: string;
};

export type EditTagValidationErrorResponse = {
  field: string;
  message: string;
}[];

export type EditTagRequestError = EditTagErrorResponse | EditTagValidationErrorResponse;

export const editTagApi = (id: number, tagData: EditTagRequest) => {
  const params = new URLSearchParams({ id: id.toString() });
  return request<EditTagRequest, boolean, EditTagRequestError>(`/manage/tags/edit?${params.toString()}`, {
    method: 'POST',
    body: tagData,
  });
};

export const removeTagApi = (id: number) => {
  const params = new URLSearchParams({ id: id.toString() });
  return request<undefined, boolean>(`/manage/tags/remove?${params.toString()}`, {
    method: 'DELETE',
  });
};

export const addTagApi = (tagData: EditTagRequest) => {
  return request<EditTagRequest, boolean, EditTagRequestError>(`/manage/tags/add`, {
    method: 'POST',
    body: tagData,
  });
};
