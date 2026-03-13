import { all, takeLatest, call, put } from 'redux-saga/effects';
import {
  FETCH_TAGS_REQUEST,
  fetchTagsSuccess,
  fetchTagsFailure,
} from './slice';
import { getTagsApi } from '../api/tagsApi';
import type { TagListItemDTO } from '@entities/tag';
import { isDisplayError, type ApiResponse } from '@shared/api';

function* doFetchTags() {
  try {
    const response: ApiResponse<TagListItemDTO[]> = yield call(getTagsApi);
    yield put(fetchTagsSuccess(response.data || []));
  } catch (error: unknown) {
    if (isDisplayError(error)) {
      yield put(fetchTagsFailure(error.displayMessage));
      return;
    }

    yield put(fetchTagsFailure('An unknown error occurred'));
  }
}

function* fetchTagsWatcher() {
  yield takeLatest(FETCH_TAGS_REQUEST, doFetchTags);
}

export function* tagsSaga() {
  yield all([fetchTagsWatcher()]);
}
