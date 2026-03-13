import { removePostApi as removePostApiBase } from '@entities/post';
import { withAuth } from '@entities/session';

export const removePostApi = withAuth(removePostApiBase);
