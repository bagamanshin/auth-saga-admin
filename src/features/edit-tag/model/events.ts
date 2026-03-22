export const EDIT_TAG_SUCCESS = 'edit-tag/EDIT_TAG_SUCCESS';

export const editTagSuccess = () => ({
  type: EDIT_TAG_SUCCESS as typeof EDIT_TAG_SUCCESS,
});

export type EditTagSuccessAction = ReturnType<typeof editTagSuccess>;
