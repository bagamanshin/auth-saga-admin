export const EDIT_AUTHOR_SUCCESS = 'edit-author/EDIT_AUTHOR_SUCCESS';

export const editAuthorSuccess = () => ({
  type: EDIT_AUTHOR_SUCCESS as typeof EDIT_AUTHOR_SUCCESS,
});

export type EditAuthorSuccessAction = ReturnType<typeof editAuthorSuccess>;
