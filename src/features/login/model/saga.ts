import { all, takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
  LOGIN_REQUEST,
  LOGOUT,
  loginSuccess,
  loginFailure,
  LOGIN_SUCCESS,
} from './slice';
import { loginApi } from '../api/login';
import { isDisplayError, type ApiResponse } from '@shared/api';
import { PATHS } from '@shared/config/routes';
import { persistSessionTokens } from '@entities/session';

export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type LoginResponseDTO = {
  access_token: string;
  refresh_token: string;
  access_expired_at: number;
  refresh_expired_at: number;
};

function* loginWorker(action: { type: string; payload: LoginRequestDTO }) {
  try {
    const response: ApiResponse<LoginResponseDTO> = yield call(loginApi, action.payload);
    yield put(persistSessionTokens(response.data));
    yield put(loginSuccess());
  } catch (error) {
    if (isDisplayError(error)) {
      yield put(loginFailure(error.displayMessage));
    }
  }
}

function* loginSuccessWorker() {
  yield put(push(PATHS.home));
}

function* logoutWorker() {
  yield put(persistSessionTokens(null));
  yield put(push(PATHS.login));
}

function* loginWatcher() {
  yield takeLatest(LOGIN_REQUEST, loginWorker);
}

function* loginSuccessWatcher() {
  yield takeLatest(LOGIN_SUCCESS, loginSuccessWorker);
}

function* logoutWatcher() {
  yield takeLatest(LOGOUT, logoutWorker);
}

export function* authSaga() {
  yield all([
    loginWatcher(),
    loginSuccessWatcher(),
    logoutWatcher()
  ]);
}
