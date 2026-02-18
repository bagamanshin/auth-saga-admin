import { all, takeLatest, call, put } from 'redux-saga/effects';
import {
  FETCH_AUTHORS_REQUEST,
  fetchAuthorsSuccess,
  fetchAuthorsFailure,
} from './slice';
import { getAuthorsApi } from '../api/authorsApi';
import type { AuthorListItem } from './types';
import type { ApiResponse } from '@shared/api';

function* doFetchAuthors() {
  try {
    const response: ApiResponse<AuthorListItem[]> = yield call(getAuthorsApi);

    if (response.status === 200) {
      yield put(fetchAuthorsSuccess(response.data || []));
    } else {
      yield put(fetchAuthorsFailure('Failed to fetch authors'));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
        yield put(fetchAuthorsFailure(error.message));
    } else {
        yield put(fetchAuthorsFailure('An unknown error occurred'));
    }
  }
}

function* fetchAuthorsWatcher() {
  yield takeLatest(FETCH_AUTHORS_REQUEST, doFetchAuthors);
}

export function* authorsSaga() {
  yield all([fetchAuthorsWatcher()]);
}
