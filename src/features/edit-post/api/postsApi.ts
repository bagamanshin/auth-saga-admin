import { withAuth } from '@entities/session';
import {
  getPostDetailApi as getPostDetailApiBase,
  editPostApi as editPostApiBase,
} from '@entities/post';

export const getPostDetailApi = withAuth(getPostDetailApiBase);
export const editPostApi = withAuth(editPostApiBase);
