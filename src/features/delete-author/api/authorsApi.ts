import { withAuth } from '@entities/session';
import { removeAuthorApi as removeAuthorApiBase } from '@entities/author';

export const removeAuthorApi = withAuth(removeAuthorApiBase);
