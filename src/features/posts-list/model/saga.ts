import { all, takeLatest, call, put } from 'redux-saga/effects';
import {
  FETCH_POSTS_REQUEST,
  fetchPostsSuccess,
  fetchPostsFailure,
} from './slice';
import { getPostsApi } from '../api/postsApi';
import type { PostDTO, PaginationDTO } from '@entities/post';
import { isDisplayError, type ApiResponse } from '@shared/api';

function* doFetchPosts(action: { type: string; payload: { page: number } }) {
  try {
    const response: ApiResponse<PostDTO[]> = yield call(getPostsApi, action.payload);
    const totalCount = parseInt(response.headers?.get('X-Pagination-Total-Count') || '0', 10);
    const pageCount = parseInt(response.headers?.get('X-Pagination-Page-Count') || '0', 10);
    const currentPage = parseInt(response.headers?.get('X-Pagination-Current-Page') || '0', 10);
    const perPage = parseInt(response.headers?.get('X-Pagination-Per-Page') || '0', 10);

    const pagination: PaginationDTO = {
      totalCount,
      pageCount,
      currentPage,
      perPage,
    };

    yield put(fetchPostsSuccess(response.data || [], pagination));
  } catch (error: unknown) {
    if (isDisplayError(error)) {
      yield put(fetchPostsFailure(error.displayMessage));
      return;
    }

    yield put(fetchPostsFailure('An unknown error occurred'));
  }
}

function* fetchPostsWatcher() {
  yield takeLatest(FETCH_POSTS_REQUEST, doFetchPosts);
}

export function* postsSaga() {
  yield all([fetchPostsWatcher()]);
}
