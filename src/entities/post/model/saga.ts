import { all, takeLatest, call, put } from 'redux-saga/effects';
import {
  FETCH_POSTS_REQUEST,
  fetchPostsSuccess,
  fetchPostsFailure,
} from './slice';
import { getPostsApi } from '../api/postsApi';
import type { Post, Pagination } from './types';
import type { ApiResponse } from '@shared/api';

function* doFetchPosts(action: { type: string; payload: { page: number } }) {
  try {
    const response: ApiResponse<Post[]> = yield call(getPostsApi, action.payload);

    if (response.status === 200 && response.headers) {
      const totalCount = parseInt(response.headers.get('X-Pagination-Total-Count') || '0', 10);
      const pageCount = parseInt(response.headers.get('X-Pagination-Page-Count') || '0', 10);
      const currentPage = parseInt(response.headers.get('X-Pagination-Current-Page') || '0', 10);
      const perPage = parseInt(response.headers.get('X-Pagination-Per-Page') || '0', 10);

      const pagination: Pagination = {
        totalCount,
        pageCount,
        currentPage,
        perPage,
      };

      yield put(fetchPostsSuccess(response.data || [], pagination));
    } else {
      yield put(fetchPostsFailure('Failed to fetch posts'));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
        yield put(fetchPostsFailure(error.message));
    } else {
        yield put(fetchPostsFailure('An unknown error occurred'));
    }
  }
}

function* fetchPostsWatcher() {
  yield takeLatest(FETCH_POSTS_REQUEST, doFetchPosts);
}

export function* postsSaga() {
  yield all([fetchPostsWatcher()]);
}
