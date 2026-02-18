import { request } from '@shared/api';
import type { Post } from '../model/types';

type GetPostsParams = {
  page: number;
};

export const getPostsApi = ({ page }: GetPostsParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
  });
  return request<undefined, Post[]>(`/manage/posts?${params.toString()}`);
};

export const getPostDetailApi = (id: number) => {
  const params = new URLSearchParams({ id: id.toString() });
  return request<undefined, Post>(`/manage/posts/detail?${params.toString()}`);
};

export interface EditPostRequest {
  code?: string;
  title?: string;
  authorId?: number;
  tagIds?: number[];
  text?: string;
  previewPicture?: File | null;
}

export type EditPostErrorResponse = {
  name: string;
  message: string;
  code: number;
  status: number;
  type: string;
};

export type EditPostValidationErrorResponse = {
  field: string;
  message: string;
}[];

export type EditPostRequestError = EditPostErrorResponse | EditPostValidationErrorResponse;

export const editPostApi = (id: number, postData: EditPostRequest) => {
  const params = new URLSearchParams({ id: id.toString() });
  return request<EditPostRequest, boolean, EditPostRequestError>(`/manage/posts/edit?${params.toString()}`, {
    method: 'POST',
    body: postData,
  });
};

export const removePostApi = (id: number) => {
  const params = new URLSearchParams({ id: id.toString() });
  return request<undefined, boolean>(`/manage/posts/remove?${params.toString()}`, {
    method: 'DELETE',
  });
};
