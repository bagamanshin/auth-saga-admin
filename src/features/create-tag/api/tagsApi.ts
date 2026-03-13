import { withAuth } from '@entities/session';
import { addTagApi as addTagApiBase } from '@entities/tag';

export const addTagApi = withAuth(addTagApiBase);
