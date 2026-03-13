import { withAuth } from '@entities/session';
import {
  getAuthorDetailApi as getAuthorDetailApiBase,
  editAuthorApi as editAuthorApiBase,
} from '@entities/author';

export const getAuthorDetailApi = withAuth(getAuthorDetailApiBase);
export const editAuthorApi = withAuth(editAuthorApiBase);
