import { call, put } from 'redux-saga/effects';
import {
  type ApiResponse,
  type BackendErrorMap,
  type RequestOptions,
  request,
} from '@shared/api';
import {
  getSessionTokens,
  refreshAccessToken,
  isUnauthorizedError,
} from './tokenRefresh';
import { persistSessionTokens, type SessionTokens } from '../model/slice';


function* getAuthHeaders(): Generator<unknown, Record<string, string>> {
  const tokens = (yield call(getSessionTokens)) as SessionTokens | null;

  if (!tokens?.access_token) {
    return {};
  }

  return {
    Authorization: `Bearer ${tokens.access_token}`,
  };
}

function* handleUnauthorized<REQ, RES>(
  error: unknown,
  endpoint: string,
  options: RequestOptions<REQ>,
  customBackendErrorMap?: BackendErrorMap,
): Generator<unknown, ApiResponse<RES>> {
  const tokens = (yield call(getSessionTokens)) as SessionTokens | null;
  const refreshToken = tokens?.refresh_token;

  if (!refreshToken) {
    yield put(persistSessionTokens(null));
    throw error;
  }

  const newTokens = (yield call(
    refreshAccessToken,
    refreshToken
  )) as SessionTokens;

  try {
    return (yield call(
      request<REQ, RES>,
      endpoint,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newTokens.access_token}`,
        },
      },
      customBackendErrorMap
    )) as ApiResponse<RES>;
  } catch (error) {
    if (isUnauthorizedError(error)) {
      yield put(persistSessionTokens(null));
    }

    throw error;
  }
}

export function* authRequest<REQ, RES>(
  endpoint: string,
  options: RequestOptions<REQ> = {},
  customBackendErrorMap?: BackendErrorMap
): Generator<unknown, ApiResponse<RES>> {
  const {
    method = 'GET',
    body,
    headers = {},
    isFormData = true,
  } = options;

  const authHeaders = (yield call(getAuthHeaders)) as Record<string, string>;

  const requestHeaders = {
    ...headers,
    ...authHeaders
  };

  try {
    return (yield call(
      request<REQ, RES>,
      endpoint,
      {
        method,
        headers: requestHeaders,
        body,
        isFormData,
      },
      customBackendErrorMap
    )) as ApiResponse<RES>;
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return (yield call(
          handleUnauthorized<REQ, RES>,
          error,
          endpoint,
          options,
          customBackendErrorMap,
        )) as ApiResponse<RES>
    }

    throw error;
  }
}
