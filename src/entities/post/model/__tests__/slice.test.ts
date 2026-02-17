import { postsReducer, fetchPostsSuccess, PostsState } from '../slice';
import { Post } from '../types';

describe('postsReducer', () => {
  const initialState: PostsState = {
    posts: [],
    pagination: {
      page: 1,
      size: 10,
      total: 0,
    },
    loading: true,
    error: null,
  };

  it('should handle fetchPostsSuccess action', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Test Post 1', body: 'Body 1', userId: 1 },
      { id: 2, title: 'Test Post 2', body: 'Body 2', userId: 1 },
    ];
    const total = 2;

    const action = fetchPostsSuccess(mockPosts, total);
    const newState = postsReducer(initialState, action);

    expect(newState.loading).toBe(false);
    expect(newState.posts).toEqual(mockPosts);
    expect(newState.pagination.total).toBe(total);
    expect(newState.error).toBeNull();
  });
});
