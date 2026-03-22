import { all, fork } from 'redux-saga/effects';
import { authSaga } from '@features/login';
import { sessionSaga } from '@entities/session';
export function* rootSaga() {
  yield all([
    fork(sessionSaga),
    fork(authSaga),
  ]);
}
