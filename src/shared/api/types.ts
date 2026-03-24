import type { BackendErrorMessageBuilder } from './errors';

export type ApiResponse<RES> = {
  data: RES;
  headers?: Headers;
};

export type Api<PAYLOAD, RES> = (
  payload?: PAYLOAD, requestFn?: RequestFn
) => Generator<unknown, ApiResponse<RES>>;

export type BackendErrorMap = {
  fallback?: BackendErrorMessageBuilder;
} & Partial<Record<number, BackendErrorMessageBuilder>>;

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
