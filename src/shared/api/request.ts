import type { ApiResponse, RequestFn, RequestOptions, BackendErrorMap } from './types';
import { call, cancelled } from 'redux-saga/effects';
import {
  AbortRequestError,
  NetworkError,
} from './errors';
import { handleErrorResponse, handleSuccessResponse } from './responseHandlers';
import { prepareRequestData } from './formDataBuilder';

const API_URL = import.meta.env.VITE_API_URL;

const request: RequestFn = function* <REQ, RES>(
  endpoint: string,
  options?: RequestOptions<REQ>,
  customBackendErrorHandlerMap?: BackendErrorMap,
) {
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

  const abortController = new AbortController();
  let response: Response;

  try {
    try {
      response = (yield call(fetch, `${API_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: requestBody,
        signal: abortController.signal,
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
      (yield call(handleErrorResponse, response, customBackendErrorHandlerMap) as never);
    }

    return (yield call(handleSuccessResponse, response)) as ApiResponse<RES>;
  } finally {
    if ((yield cancelled()) as boolean) {
      abortController.abort();
    }
  }
};

export { request };
