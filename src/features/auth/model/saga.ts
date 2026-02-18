import { all, takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
  LOGIN_REQUEST,
  LOGOUT,
  loginSuccess,
  loginFailure,
  setAuthTokens,
  LOGIN_SUCCESS,
  RETRIEVE_AUTH_TOKENS,
  PERSIST_AUTH_TOKENS,
  persistAuthTokens,
} from './slice';
import { loginApi } from '../api/authApi';
import type { LoginRequest, LoginResponse, AuthErrorResponse, AuthValidationErrorResponse, LoginRequestError } from '@shared/api/authApi';
import type { ApiResponse } from '@shared/api/types';
import { PATHS } from '@shared/lib/paths';
import { deleteCookie, getCookie, setCookie } from '@shared/lib/cookies';
import { AUTH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@shared/lib/constants';

function* loginWorker(action: { type: string; payload: LoginRequest }) {
  try {
    const response: ApiResponse<LoginResponse, LoginRequestError> = yield call(loginApi, action.payload);

    if (response.status === 200 && response.data) {
      yield put(persistAuthTokens(response.data));
      yield put(loginSuccess());
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

function* loginSuccessWorker() {
  yield put(push(PATHS.home));
}

function* logoutWorker() {
  yield put(persistAuthTokens(null));
  yield put(push(PATHS.login));
}

function* retrieveAuthTokensWorker() {
  const accessToken = getCookie(AUTH_TOKEN_COOKIE);
  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);

  if (accessToken && refreshToken) {
    yield put(setAuthTokens({ access_token: accessToken, refresh_token: refreshToken }));
  }
}

function* persistAuthTokensWorker(action: { type: string; payload: LoginResponse | null; meta?: { onComplete: () => void } }) {
  if (action.payload) {
    const { access_token, refresh_token, access_expired_at, refresh_expired_at } = action.payload;

    yield call(setCookie, AUTH_TOKEN_COOKIE, access_token, {
      expires: new Date(access_expired_at * 1000),
    });

    yield call(setCookie, REFRESH_TOKEN_COOKIE, refresh_token, {
      expires: new Date(refresh_expired_at * 1000),
    });

    yield put(setAuthTokens({ access_token, refresh_token }));
  } else {
    yield call(deleteCookie, AUTH_TOKEN_COOKIE);
    yield call(deleteCookie, REFRESH_TOKEN_COOKIE);

    yield put(setAuthTokens(null));
  }

  if (action.meta && typeof action.meta.onComplete === 'function') {
    yield call(action.meta.onComplete);
  }
}

function* persistAuthTokensWatcher() {
  yield takeLatest(PERSIST_AUTH_TOKENS, persistAuthTokensWorker);
}

function* retrieveAuthTokensWatcher() {
  yield takeLatest(RETRIEVE_AUTH_TOKENS, retrieveAuthTokensWorker);
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
    retrieveAuthTokensWatcher(),
    persistAuthTokensWatcher(),
    loginWatcher(),
    loginSuccessWatcher(),
    logoutWatcher()
  ]);
}
