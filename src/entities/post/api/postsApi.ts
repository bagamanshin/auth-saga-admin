import { request } from '@shared/api';
import type { Post } from '../model/types';

type GetPostsParams = {
  page: number;
  size: number;
};

export const getPostsApi = ({ page, size }: GetPostsParams) => {
  const params = new URLSearchParams({
    _page: page.toString(),
    _limit: size.toString(),
  });
  return request<Post[]>(`posts?${params.toString()}`);
};
