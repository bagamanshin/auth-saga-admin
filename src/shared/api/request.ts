import type { ApiResponse } from './types';
import { call } from 'redux-saga/effects';
import {
  AbortRequestError,
  NetworkError,
} from './errors';
import { handleErrorResponse, handleSuccessResponse, type BackendErrorMap } from './responseHandlers';
import { prepareRequestData } from './formDataBuilder';

const API_URL = import.meta.env.VITE_API_URL;

export type RequestOptions<REQ> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: REQ;
  headers?: Record<string, string>;
  isFormData?: boolean;
};

export type RequestFn = <REQ, RES>(
  endpoint: string,
  options?: RequestOptions<REQ>,
  customBackendErrorHandlerMap?: BackendErrorMap
) => Generator<unknown, ApiResponse<RES>>;

export function* request<REQ, RES>(
  endpoint: string,
  options?: RequestOptions<REQ>,
  customBackendErrorHandlerMap?: BackendErrorMap
): Generator<unknown, ApiResponse<RES> | never> {
  const {
    method = 'GET',
    body,
    headers = {},
    isFormData = true,
  } = options || {};

  const { requestBody, headers: contentTypeHeaders } = prepareRequestData(body, isFormData);

  const requestHeaders: HeadersInit = {
    ...contentTypeHeaders,
    ...headers,
  };

  let response: Response;

  try {
    response = (yield call(fetch, `${API_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: requestBody,
    })) as Response;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AbortRequestError(error.message || 'Request was aborted');
    }

    if (error instanceof TypeError) {
      throw new NetworkError(error.message || 'Network error');
    }

    throw error;
  }

  if (!response.ok) {
    yield call(handleErrorResponse, response, customBackendErrorHandlerMap);
  }

  return (yield call(handleSuccessResponse<RES>, response)) as ApiResponse<RES>;
}
