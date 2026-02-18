import { all, takeLatest, call, put } from 'redux-saga/effects';
import {
  FETCH_TAGS_REQUEST,
  fetchTagsSuccess,
  fetchTagsFailure,
} from './slice';
import { getTagsApi } from '../api/tagsApi';
import type { TagListItem } from './types';
import type { ApiResponse } from '@shared/api';

function* doFetchTags() {
  try {
    const response: ApiResponse<TagListItem[]> = yield call(getTagsApi);

    if (response.status === 200) {
      yield put(fetchTagsSuccess(response.data || []));
    } else {
      yield put(fetchTagsFailure('Failed to fetch tags'));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
        yield put(fetchTagsFailure(error.message));
    } else {
        yield put(fetchTagsFailure('An unknown error occurred'));
    }
  }
}

function* fetchTagsWatcher() {
  yield takeLatest(FETCH_TAGS_REQUEST, doFetchTags);
}

export function* tagsSaga() {
  yield all([fetchTagsWatcher()]);
}
