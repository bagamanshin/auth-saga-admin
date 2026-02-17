import type { Post, Pagination } from './types';

// Action Types
export const FETCH_POSTS_REQUEST = 'posts/FETCH_POSTS_REQUEST';
export const FETCH_POSTS_SUCCESS = 'posts/FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'posts/FETCH_POSTS_FAILURE';
export const SET_POSTS_PAGINATION = 'posts/SET_POSTS_PAGINATION';

// State
export interface PostsState {
  posts: Post[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  pagination: {
    page: 1,
    size: 10,
    total: 0,
  },
  loading: false,
  error: null,
};

// Action Interfaces
interface FetchPostsRequestAction {
    type: typeof FETCH_POSTS_REQUEST;
    payload: { page: number; size: number };
}

interface FetchPostsSuccessAction {
    type: typeof FETCH_POSTS_SUCCESS;
    payload: { posts: Post[]; total: number };
}

interface FetchPostsFailureAction {
    type: typeof FETCH_POSTS_FAILURE;
    payload: string;
}

interface SetPostsPaginationAction {
    type: typeof SET_POSTS_PAGINATION;
    payload: { page: number; size: number };
}

type PostsAction = FetchPostsRequestAction | FetchPostsSuccessAction | FetchPostsFailureAction | SetPostsPaginationAction;

// Reducer
export const postsReducer = (state = initialState, action: PostsAction): PostsState => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_POSTS_SUCCESS:
      return { ...state, loading: false, posts: action.payload.posts, pagination: { ...state.pagination, total: action.payload.total } };
    case FETCH_POSTS_FAILURE:
      return { ...state, loading: false, error: action.payload, posts: [] };
    case SET_POSTS_PAGINATION:
      return { ...state, pagination: { ...state.pagination, page: action.payload.page, size: action.payload.size } };
    default:
      return state;
  }
};

// Action Creators
export const fetchPostsRequest = (params: { page: number; size: number }) => ({
  type: FETCH_POSTS_REQUEST,
  payload: params,
});

export const fetchPostsSuccess = (posts: Post[], total: number) => ({
  type: FETCH_POSTS_SUCCESS,
  payload: { posts, total },
});

export const fetchPostsFailure = (error: string) => ({
  type: FETCH_POSTS_FAILURE,
  payload: error,
});

export const setPostsPagination = (params: { page: number, size: number }) => ({
    type: SET_POSTS_PAGINATION,
    payload: params,
});
