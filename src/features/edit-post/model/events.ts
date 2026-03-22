export const EDIT_POST_SUCCESS = 'edit-post/EDIT_POST_SUCCESS';

export const editPostSuccess = () => ({
  type: EDIT_POST_SUCCESS as typeof EDIT_POST_SUCCESS,
});

export type EditPostSuccessAction = ReturnType<typeof editPostSuccess>;
