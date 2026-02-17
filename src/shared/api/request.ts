import { getCookie } from '@shared/lib/cookies';
import { TokenExpiredError } from '@shared/lib/errors';
import type { ApiResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL;

type RequestOptions<REQ = undefined> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: REQ;
  headers?: Record<string, string>;
  isAuth?: boolean;
};

export async function request<REQ, RES, ERR>(
  endpoint: string,
  options: RequestOptions<REQ> = {}
): Promise<ApiResponse<RES, ERR>> {
  const { method = 'GET', body, headers = {}, isAuth = true } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (isAuth) {
    const token = getCookie('_auth');
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : null,
    });

    if (response.status === 401) {
      throw new TokenExpiredError();
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      return {
        status: response.status as ApiResponse<RES, ERR>['status'],
        data: null,
        error: errorData as ERR,
      };
    }

    // Handle empty response body for methods like DELETE
    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
      return { status: response.status as ApiResponse<RES, ERR>['status'], data: null, headers: response.headers };
    }

    const data: RES = await response.json();
    return { status: response.status as ApiResponse<RES, ERR>['status'], data, headers: response.headers };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw error; // Re-throw for the saga to catch
    }

    const genericError: ERR = { message: error instanceof Error ? error.message : 'An unexpected error occurred' } as ERR;
    return {
      status: 500, // Assuming 500 for unhandled client-side errors or network issues
      data: null,
      error: genericError,
    };
  }
}
