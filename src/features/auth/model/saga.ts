import { all, takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
  LOGIN_REQUEST,
  LOGOUT,
  loginSuccess,
  loginFailure,
} from './slice';
import { loginApi } from '../api/authApi';
import type { LoginRequest, LoginResponse, AuthErrorResponse, AuthValidationErrorResponse, LoginRequestError } from '../api/authApi';
import { setCookie, deleteCookie } from '@shared/lib/cookies';
import type { ApiResponse } from '@shared/api/types';

function* loginWorker(action: { type: string; payload: LoginRequest }) {
  try {
    const response: ApiResponse<LoginResponse, LoginRequestError> = yield call(loginApi, action.payload);

    if (response.status === 200 && response.data) {
      const { access_token, refresh_token, access_expired_at, refresh_expired_at } = response.data;

      setCookie('_auth', access_token, { 'max-age': access_expired_at });
      setCookie('_auth_refresh', refresh_token, { 'max-age': refresh_expired_at });

      yield put(loginSuccess());
      yield put(push('/'));
    } else {

      let errorMessage: string;

      switch (response.status) {
        case 400: {
          const authError = response.error as AuthErrorResponse;
          errorMessage = authError.message;
          break;
        }
        case 422: {
            const validationErrors = response.error as AuthValidationErrorResponse;
            errorMessage = validationErrors.map(err => `${err.field}: ${err.message}`).join(', ');
            break;
          }
        default:
          errorMessage = `An unknown error occurred during login with HTTP status ${response.status}.`;
          break;
      }

      yield put(loginFailure(errorMessage));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
        yield put(loginFailure(error.message));
    } else {
        yield put(loginFailure('An unexpected error occurred'));
    }
  }
}

function* logoutWorker() {
  deleteCookie('_auth');
  deleteCookie('_auth_refresh');
  yield put(push('/login'));
}

function* loginWatcher() {
  yield takeLatest(LOGIN_REQUEST, loginWorker);
}

function* logoutWatcher() {
  yield takeLatest(LOGOUT, logoutWorker);
}

export function* authSaga() {
  yield all([loginWatcher(), logoutWatcher()]);
}
