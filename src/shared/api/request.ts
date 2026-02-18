import type { ApiResponse } from './types';
import { isPlainObject } from '@shared/lib/utils';
import { refreshTokenApi } from './authApi';
import { store } from '@app/store';
import { logout, persistAuthTokens } from '@features/auth/model/slice';
import { Mutex } from 'async-mutex';

const API_URL = import.meta.env.VITE_API_URL;

type RequestOptions<REQ = undefined> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: REQ;
  headers?: Record<string, string>;
  isAuth?: boolean;
  isFormData?: boolean;
  isRetryRequest?: boolean;
  isRefreshingTokensRequest?: boolean;
};

const mutex = new Mutex();

export async function request<REQ, RES, ERR = undefined>(
  endpoint: string,
  options: RequestOptions<REQ> = {}
): Promise<ApiResponse<RES, ERR>> {
  if (!options.isRefreshingTokensRequest) {
    await mutex.waitForUnlock();
  }

  const { method = 'GET', body, headers = {}, isAuth = true, isFormData = true, isRetryRequest = false } = options;

  const requestHeaders: HeadersInit = {
    ...headers,
  };

  let requestBody: BodyInit | null = null;

  if (isFormData && isPlainObject(body)) {
    const fd = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      if (value instanceof File) {
        fd.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item instanceof File) {
            fd.append(`${key}[]`, item);
          } else {
            fd.append(`${key}[]`, item ? String(item) : '');
          }
        });
      } else {fd.append(key, value ? String(value) : '');}
    });
  
    requestBody = fd;
  } else {
    requestHeaders['Content-Type'] = 'application/json';
    requestBody = body ? JSON.stringify(body) : null;
  }

  if (isAuth) {
    const token = store.getState().auth.tokens?.access_token;
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: requestBody,
    });

    if (response.status === 401 && isAuth) {
      if (isRetryRequest) {
        store.dispatch(logout());
        return Promise.reject('Repeated 401 error');
      }

      if (mutex.isLocked()) {
        await mutex.waitForUnlock();

        const newToken = store.getState().auth.tokens?.access_token;

        return request(endpoint, {
          ...options,
          isRetryRequest: true,
          headers: {
            ...headers,
            Authorization: newToken ? `Bearer ${newToken}` : '',
          },
        });
      }

      await mutex.runExclusive(async () => {
        const refreshToken = store.getState().auth.tokens?.refresh_token;

        if (!refreshToken) {
          store.dispatch(logout());
          throw new Error('No refresh token');
        }

        const refreshResponse = await refreshTokenApi(refreshToken);

        if (!refreshResponse.data) {
          store.dispatch(logout());
          throw new Error('Refresh failed');
        }

        await new Promise<void>((resolve) => {
          store.dispatch(persistAuthTokens(refreshResponse.data, resolve));
        });
      });

      const newToken = store.getState().auth.tokens?.access_token;

      return request(endpoint, {
        ...options,
        isRetryRequest: true,
        headers: {
          ...headers,
          Authorization: newToken ? `Bearer ${newToken}` : '',
        },
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      return {
        status: response.status as ApiResponse<RES, ERR>['status'],
        data: null,
        error: errorData as ERR,
      };
    }

    const data: RES = await response.json();
    return { status: response.status as ApiResponse<RES, ERR>['status'], data, headers: response.headers };
  } catch (error) {
    const genericError: ERR = { message: error instanceof Error ? error.message : 'An unexpected error occurred' } as ERR;
    return {
      status: 500,
      data: null,
      error: genericError,
    };
  }
}
