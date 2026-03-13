import { withAuth } from '@entities/session';
import {
  getTagDetailApi as getTagDetailApiBase,
  editTagApi as editTagApiBase,
} from '@entities/tag';

export const getTagDetailApi = withAuth(getTagDetailApiBase);
export const editTagApi = withAuth(editTagApiBase);
