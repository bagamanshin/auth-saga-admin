import type { PostDTO, PaginationDTO } from '@entities/post';
import type { Reducer } from 'redux';

export const FETCH_POSTS_REQUEST = 'posts/FETCH_POSTS_REQUEST';
export const FETCH_POSTS_SUCCESS = 'posts/FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'posts/FETCH_POSTS_FAILURE';

export interface PostsState {
  posts: PostDTO[];
  pagination: PaginationDTO | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  pagination: null,
  loading: false,
  error: null,
};

interface FetchPostsRequestAction {
    type: typeof FETCH_POSTS_REQUEST;
    payload: { page: number };
}

interface FetchPostsSuccessAction {
    type: typeof FETCH_POSTS_SUCCESS;
    payload: { posts: PostDTO[]; pagination: PaginationDTO };
}

interface FetchPostsFailureAction {
    type: typeof FETCH_POSTS_FAILURE;
    payload: string;
}

type PostsAction = FetchPostsRequestAction | FetchPostsSuccessAction | FetchPostsFailureAction;

export const postsReducer = ((state = initialState, action: PostsAction): PostsState => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_POSTS_SUCCESS:
      return { ...state, loading: false, posts: action.payload.posts, pagination: action.payload.pagination };
    case FETCH_POSTS_FAILURE:
      return { ...state, loading: false, error: action.payload, posts: [] };
    default:
      return state;
  }
}) as Reducer<PostsState>;

export const fetchPostsRequest = (params: { page: number }) => ({
  type: FETCH_POSTS_REQUEST,
  payload: params,
});

export const fetchPostsSuccess = (posts: PostDTO[], pagination: PaginationDTO) => ({
  type: FETCH_POSTS_SUCCESS,
  payload: { posts, pagination },
});

export const fetchPostsFailure = (error: string) => ({
  type: FETCH_POSTS_FAILURE,
  payload: error,
});
