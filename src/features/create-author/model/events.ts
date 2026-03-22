export const CREATE_AUTHOR_SUCCESS = 'create-author/CREATE_AUTHOR_SUCCESS';

export const createAuthorSuccess = () => ({
  type: CREATE_AUTHOR_SUCCESS as typeof CREATE_AUTHOR_SUCCESS,
});

export type CreateAuthorSuccessAction = ReturnType<typeof createAuthorSuccess>;
