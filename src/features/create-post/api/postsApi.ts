import { withAuth } from '@entities/session';
import { addPostApi as addPostApiBase } from '@entities/post';

export const addPostApi = withAuth(addPostApiBase);
