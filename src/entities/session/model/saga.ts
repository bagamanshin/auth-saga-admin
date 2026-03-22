import { all, call, cancelled, put, select, takeLatest, takeLeading } from 'redux-saga/effects';
import {
  PERSIST_SESSION_TOKENS,
  REFRESH_SESSION_TOKENS_REQUEST,
  clearSessionTokens,
  refreshSessionTokensFailure,
  refreshSessionTokensSuccess,
  setSessionTokens,
  persistSessionTokens,
  selectSessionTokens,
  type PersistSessionPayload,
  type SessionTokens,
} from './slice';
import {
  getPersistedSessionTokens,
  persistSessionTokensToCookies,
} from './storage';
import { refreshTokenApi, type RefreshTokenResponseDTO } from '../api/refreshTokenApi';
import { type ApiResponse } from '@shared/api';

function* bootstrapSessionWorker() {
  const tokens = getPersistedSessionTokens();

  if (tokens) {
    yield put(setSessionTokens(tokens));
  }
}

function* persistSessionTokensWorker(action: { type: string; payload: PersistSessionPayload }) {
  yield put(setSessionTokens(action.payload));
  yield call(persistSessionTokensToCookies, action.payload);
}

function* persistSessionTokensWatcher() {
  yield takeLatest(PERSIST_SESSION_TOKENS, persistSessionTokensWorker);
}

function* refreshSessionTokensWorker(): Generator<unknown, void> {
  try {
    const tokens = (yield select(selectSessionTokens)) as SessionTokens | null;
    const refreshToken = tokens?.refresh_token;

    if (!refreshToken) {
      yield put(clearSessionTokens());
      yield put(refreshSessionTokensFailure());
      return;
    }

    const refreshResponse = (yield call(
      refreshTokenApi,
      refreshToken
    )) as ApiResponse<RefreshTokenResponseDTO>;

    yield put(persistSessionTokens(refreshResponse.data));
    yield put(refreshSessionTokensSuccess(refreshResponse.data));
    // eslint-disable-next-line
  } catch (err) {
    yield put(clearSessionTokens());
    yield put(refreshSessionTokensFailure());
  } finally {
    if (yield cancelled()) {
      yield put(refreshSessionTokensFailure());
    }
  }
}

function* refreshSessionTokensWatcher() {
  yield takeLeading(REFRESH_SESSION_TOKENS_REQUEST, refreshSessionTokensWorker);
}

export function* sessionSaga() {
  yield call(bootstrapSessionWorker);
  yield all([
    persistSessionTokensWatcher(),
    refreshSessionTokensWatcher(),
  ]);
}
