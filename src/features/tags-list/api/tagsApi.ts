import { withAuth } from '@entities/session';
import { getTagsApi as getTagsApiBase } from '@entities/tag';

export const getTagsApi = withAuth(getTagsApiBase);
