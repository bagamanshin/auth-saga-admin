import { withAuth } from '@entities/session';
import { getAuthorsApi as getAuthorsApiBase } from '@entities/author';

export const getAuthorsApi = withAuth(getAuthorsApiBase);
