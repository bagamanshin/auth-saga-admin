export const CREATE_POST_SUCCESS = 'create-post/CREATE_POST_SUCCESS';

export const createPostSuccess = () => ({
  type: CREATE_POST_SUCCESS as typeof CREATE_POST_SUCCESS,
});

export type CreatePostSuccessAction = ReturnType<typeof createPostSuccess>;
