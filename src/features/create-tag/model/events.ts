export const CREATE_TAG_SUCCESS = 'create-tag/CREATE_TAG_SUCCESS';

export const createTagSuccess = () => ({
  type: CREATE_TAG_SUCCESS as typeof CREATE_TAG_SUCCESS,
});

export type CreateTagSuccessAction = ReturnType<typeof createTagSuccess>;
