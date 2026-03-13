import { createApi } from '@shared/api';
import type {
  PostDTO,
  EditPostRequestDTO,
} from '../model/types';

type GetPostsParams = {
  page: number;
};

type GetPostDetailParams = {
  id: number;
};

type EditPostParams = {
  id: number;
  postData: EditPostRequestDTO;
};

type RemovePostParams = {
  id: number;
};

type AddPostParams = {
  postData: EditPostRequestDTO;
};

export const getPostsApi = createApi<GetPostsParams, undefined, PostDTO[]>({
  endpoint: ({ page }) =>
    `/manage/posts?${new URLSearchParams({
      page: page.toString(),
    }).toString()}`,
});

export const getPostDetailApi = createApi<GetPostDetailParams, undefined, PostDTO>({
  endpoint: ({ id }) =>
    `/manage/posts/detail?${new URLSearchParams({
      id: id.toString(),
    }).toString()}`,
});

export const editPostApi = createApi<EditPostParams, EditPostRequestDTO, boolean>({
  endpoint: ({ id }) =>
    `/manage/posts/edit?${new URLSearchParams({
      id: id.toString(),
    }).toString()}`,
  options: ({ postData }) => ({
    method: 'POST',
    body: postData,
  }),
});

export const removePostApi = createApi<RemovePostParams, undefined, boolean>({
  endpoint: ({ id }) =>
    `/manage/posts/remove?${new URLSearchParams({
      id: id.toString(),
    }).toString()}`,
  options: {
    method: 'DELETE',
  },
});

export const addPostApi = createApi<AddPostParams, EditPostRequestDTO, boolean>({
  endpoint: '/manage/posts/add',
  options: ({ postData }) => ({
    method: 'POST',
    body: postData,
  }),
});
