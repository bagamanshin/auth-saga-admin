import { call, put, select } from 'redux-saga/effects';
import { refreshTokenApi, type RefreshTokenResponseDTO } from './refreshTokenApi';
import {
  persistSessionTokens,
  selectSessionTokens,
  type SessionTokens,
} from '../model/slice';
import { BackendError, type ApiResponse } from '@shared/api';

/**
 * Gets current session tokens from Redux store
 */
export function* getSessionTokens(): Generator<unknown, SessionTokens | null> {
  return (yield select(selectSessionTokens)) as SessionTokens | null;
}

/**
 * Attempts to refresh access token using refresh token
 */
export function* refreshAccessToken(
  refreshToken: string
): Generator<unknown, NonNullable<SessionTokens>> {
  try {
    const refreshResponse = (yield call(
      refreshTokenApi,
      refreshToken
    )) as ApiResponse<RefreshTokenResponseDTO>;

    yield put(persistSessionTokens(refreshResponse.data));
    return refreshResponse.data as NonNullable<SessionTokens>;
  } catch (error) {
    yield put(persistSessionTokens(null));
    throw error;
  }
}

/**
 * Determines if error is 401 Unauthorized
 */
export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof BackendError && error.status === 401;
}
