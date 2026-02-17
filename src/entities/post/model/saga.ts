import { all, takeLatest, call, put, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
  FETCH_POSTS_REQUEST,
  SET_POSTS_PAGINATION,
  fetchPostsSuccess,
  fetchPostsFailure,
} from './slice';
import { getPostsApi } from '../api/postsApi';
import type { Post } from './types';
import type { ApiResponse } from '@shared/api';
import type { RootState } from '@app/store';
import { apiCallSaga } from '@features/auth/model/refreshSaga';

// The actual API call logic
function* doFetchPosts(action: { type: string; payload: { page: number; size: number } }) {
  const response: ApiResponse<Post[]> = yield call(getPostsApi, action.payload);

  if (response.success && response.headers) {
    const totalCount = response.headers.get('X-Total-Count');
    yield put(fetchPostsSuccess(response.data || [], totalCount ? parseInt(totalCount, 10) : 0));
  } else {
    yield put(fetchPostsFailure(response.error?.message || 'Failed to fetch posts'));
  }
}

// The worker that wraps the API call with the refresh logic
function* fetchPostsWorker(action: { type: string; payload: { page: number; size: number } }) {
  try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yield call(apiCallSaga as any, doFetchPosts, action);
  } catch (error: unknown) {
    if (error instanceof Error) {
        yield put(fetchPostsFailure(error.message));
    } else {
        yield put(fetchPostsFailure('An unknown error occurred'));
    }
  }
}

function* setPaginationWorker(action: { type: string; payload: { page: number; size: number } }) {
  const { page, size } = action.payload;
  const currentPath: string = yield select((state: RootState) => state.router.location.pathname);
  yield put(push(`${currentPath}?page=${page}&size=${size}`));
}

function* fetchPostsWatcher() {
  yield takeLatest(FETCH_POSTS_REQUEST, fetchPostsWorker);
}

function* setPaginationWatcher() {
  yield takeLatest(SET_POSTS_PAGINATION, setPaginationWorker);
}

export function* postsSaga() {
  yield all([fetchPostsWatcher(), setPaginationWatcher()]);
}
