import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  PERSIST_SESSION_TOKENS,
  setSessionTokens,
  type PersistSessionPayload,
} from './slice';
import {
  getPersistedSessionTokens,
  persistSessionTokensToCookies,
} from './storage';

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

export function* sessionSaga() {
  yield call(bootstrapSessionWorker);
  yield all([persistSessionTokensWatcher()]);
}
