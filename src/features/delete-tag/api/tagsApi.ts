import { withAuth } from '@entities/session';
import { removeTagApi as removeTagApiBase } from '@entities/tag';

export const removeTagApi = withAuth(removeTagApiBase);
