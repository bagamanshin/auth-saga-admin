import { all, fork } from 'redux-saga/effects';
import { authSaga } from '@features/auth';
import { postsSaga } from '@entities/post';

export function* rootSaga() {
  yield all([fork(authSaga), fork(postsSaga)]);
}
