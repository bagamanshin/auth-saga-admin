import { call, put } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { TokenExpiredError } from '@shared/lib/errors';
import { getCookie, setCookie } from '@shared/lib/cookies';
import { refreshTokenApi } from '../api/authApi';
import { logout } from './slice';

// This is a generic saga that wraps other sagas making API calls
export function* apiCallSaga<Args extends unknown[]>(
  saga: (...args: Args) => unknown,
  ...args: Args
): SagaIterator {
  try {
    // First attempt to call the saga
    const result = yield call(saga, ...args);
    return result;
  } catch (error) {
    // If the error is a TokenExpiredError, try to refresh the token
    if (error instanceof TokenExpiredError) {
      try {
        const refreshToken = getCookie('_auth_refresh');
        if (!refreshToken) {
          // If no refresh token is available, logout
          yield put(logout());
          return;
        }

        // Call the refresh token API
        const response: { data: { access_token: string } } = yield call(
          refreshTokenApi,
          refreshToken
        );
        const { access_token } = response.data;

        // Update the access token cookie
        setCookie('_auth', access_token, { 'max-age': 3600 });

        // Retry the original saga
        const result = yield call(saga, ...args);
        return result;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_refreshError) {
        // If the refresh token call also fails, logout
        yield put(logout());
        return;
      }
    } else {
      // For any other error, re-throw it
      throw error;
    }
  }
}
