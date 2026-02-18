import { all, fork } from 'redux-saga/effects';
import { authSaga } from '@features/auth';

export function* rootSaga() {
  yield all([fork(authSaga)]);
}
