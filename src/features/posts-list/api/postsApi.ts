import { withAuth } from '@entities/session';
import { getPostsApi as getPostsApiBase } from '@entities/post';

export const getPostsApi = withAuth(getPostsApiBase);
