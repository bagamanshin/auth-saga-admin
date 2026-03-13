import { withAuth } from '@entities/session';
import { addAuthorApi as addAuthorApiBase } from '@entities/author';

export const addAuthorApi = withAuth(addAuthorApiBase);
