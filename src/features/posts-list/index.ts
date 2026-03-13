export { PostList } from './ui/PostList';

export {
  postsReducer,
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  type PostsState,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
} from './model/slice';

export { postsSaga } from './model/saga';
