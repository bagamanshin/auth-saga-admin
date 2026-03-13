import { all, takeLatest, call, put } from 'redux-saga/effects';
import {
  FETCH_AUTHORS_REQUEST,
  fetchAuthorsSuccess,
  fetchAuthorsFailure,
} from './slice';
import { getAuthorsApi } from '../api/authorsApi';
import type { AuthorListItemDTO } from '@entities/author';
import { isDisplayError, type ApiResponse } from '@shared/api';

function* doFetchAuthors() {
  try {
    const response: ApiResponse<AuthorListItemDTO[]> = yield call(getAuthorsApi);
    yield put(fetchAuthorsSuccess(response.data || []));
  } catch (error: unknown) {
    if (isDisplayError(error)) {
      yield put(fetchAuthorsFailure(error.displayMessage));
      return;
    }
  }
}

function* fetchAuthorsWatcher() {
  yield takeLatest(FETCH_AUTHORS_REQUEST, doFetchAuthors);
}

export function* authorsSaga() {
  yield all([fetchAuthorsWatcher()]);
}
