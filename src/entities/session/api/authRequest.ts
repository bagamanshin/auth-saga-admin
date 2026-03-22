import { call, put, select, take } from 'redux-saga/effects';
import {
  type ApiResponse,
  type BackendErrorMap,
  type RequestOptions,
  request,
} from '@shared/api';
import {
  clearSessionTokens,
  refreshSessionTokensRequest,
  refreshSessionTokensSuccess,
  refreshSessionTokensFailure,
  REFRESH_SESSION_TOKENS_SUCCESS,
  REFRESH_SESSION_TOKENS_FAILURE,
  selectSessionRefreshPending,
  selectSessionTokens,
  type SessionTokens,
} from '../model/slice';
import { isUnauthorizedError } from '../lib/isUnauthorizedError';
import { AuthRequestPreventedError } from './errors';

type RefreshAction =
  | ReturnType<typeof refreshSessionTokensSuccess>
  | ReturnType<typeof refreshSessionTokensFailure>;

function* getAuthHeaders(): Generator<unknown, Record<string, string>> {
  const tokens = (yield select(selectSessionTokens)) as SessionTokens | null;

  if (!tokens?.access_token) {
    throw new AuthRequestPreventedError();
  }

  return { Authorization: `Bearer ${tokens.access_token}` };
}

function* withAuthHeaders<REQ>(
  options: RequestOptions<REQ>,
): Generator<unknown, RequestOptions<REQ>> {
  const authHeaders = (yield call(getAuthHeaders)) as Record<string, string>;

  return {
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders,
    },
  };
}

function* requestWithAuth<REQ, RES>(
  endpoint: string,
  options: RequestOptions<REQ>,
  customBackendErrorMap?: BackendErrorMap,
): Generator<unknown, ApiResponse<RES>> {
  const requestOptions = (yield call(
    withAuthHeaders<REQ>,
    options,
  )) as RequestOptions<REQ>;

  return (yield call(
    request<REQ, RES>,
    endpoint,
    requestOptions,
    customBackendErrorMap,
  )) as ApiResponse<RES>;
}

function* waitForRefreshResolution(): Generator<unknown, boolean> {
  const action = (yield take([
    REFRESH_SESSION_TOKENS_SUCCESS,
    REFRESH_SESSION_TOKENS_FAILURE,
  ])) as RefreshAction;

  return action.type === REFRESH_SESSION_TOKENS_SUCCESS;
}

function* clearSessionAndThrow(error: unknown): Generator<unknown, never> {
  yield put(clearSessionTokens());
  throw error;
}

function* ensureRefreshSucceeded(error: unknown): Generator<unknown, void> {
  const refreshSucceeded = (yield call(waitForRefreshResolution)) as boolean;

  if (refreshSucceeded) {
    return;
  }

  yield call(clearSessionAndThrow, error);
}

function* startRefreshIfNeeded(error: unknown): Generator<unknown, void> {
  const refreshPending = (yield select(selectSessionRefreshPending)) as boolean;

  if (refreshPending) {
    return;
  }

  const tokens = (yield select(selectSessionTokens)) as SessionTokens | null;

  if (!tokens?.refresh_token) {
    yield call(clearSessionAndThrow, error);
  }

  yield put(refreshSessionTokensRequest());
}

function* retryAfterUnauthorized<REQ, RES>(
  originalError: unknown,
  endpoint: string,
  options: RequestOptions<REQ>,
  customBackendErrorMap?: BackendErrorMap,
): Generator<unknown, ApiResponse<RES>> {
  yield call(startRefreshIfNeeded, originalError);
  yield call(ensureRefreshSucceeded, originalError);

  try {
    return (yield call(
      requestWithAuth<REQ, RES>,
      endpoint,
      options,
      customBackendErrorMap,
    )) as ApiResponse<RES>;
  } catch (retryError) {
    if (isUnauthorizedError(retryError)) {
      yield put(clearSessionTokens());
    }

    throw retryError;
  }
}

export function* authRequest<REQ, RES>(
  endpoint: string,
  options: RequestOptions<REQ> = {},
  customBackendErrorMap?: BackendErrorMap,
): Generator<unknown, ApiResponse<RES>> {
  const refreshPending = (yield select(selectSessionRefreshPending)) as boolean;

  if (refreshPending) {
    yield call(ensureRefreshSucceeded, new AuthRequestPreventedError());
  }

  try {
    return (yield call(
      requestWithAuth<REQ, RES>,
      endpoint,
      options,
      customBackendErrorMap,
    )) as ApiResponse<RES>;
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return (yield call(
        retryAfterUnauthorized<REQ, RES>,
        error,
        endpoint,
        options,
        customBackendErrorMap,
      )) as ApiResponse<RES>;
    }

    throw error;
  }
}
