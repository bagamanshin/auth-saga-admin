import { call } from 'redux-saga/effects';
import {
  BackendError,
  BackendFormValidationError,
  BackendGeneralError,
  CustomBackendError,
  InternalBackendError,
  NotAuthorizedBackendError,
  ResponseParseError,
  UnknownBackendError,
  type BackendErrorParams,
  type BackendErrorMessageBuilder,
} from './errors';
import type { ApiResponse } from './types';

export type BackendErrorMap = {
  fallback?: BackendErrorMessageBuilder;
} & Partial<Record<number, BackendErrorMessageBuilder>>;

type BackendErrorConstructor = new (
  params: BackendErrorParams<never>
) => BackendError;

const defaultBackendErrorMap: {
  fallback: typeof UnknownBackendError;
} & Record<number, BackendErrorConstructor> = {
  400: BackendGeneralError,
  401: NotAuthorizedBackendError,
  404: BackendGeneralError,
  422: BackendFormValidationError,
  500: InternalBackendError,
  fallback: UnknownBackendError,
};

/**
 * Creates appropriate backend error instance based on status code
 */
export function createBackendError(
  status: number,
  dto: unknown,
  customErrorMap?: BackendErrorMap
): BackendError {
  // Check for custom message builder first
  const customMessageBuilder = customErrorMap?.[status] ?? customErrorMap?.fallback;

  if (customMessageBuilder) {
    return new CustomBackendError({
      dto,
      status,
      getDisplayMessage: customMessageBuilder,
    });
  }

  // Fall back to default error class map
  const ErrorClass = defaultBackendErrorMap[status] ?? defaultBackendErrorMap.fallback;

  return new ErrorClass({
    dto: dto as never,
    status,
  });
}

/**
 * Handles error response parsing and throws appropriate error
 */
export function* handleErrorResponse(
  response: Response,
  customErrorMap?: BackendErrorMap
): Generator<unknown, never> {
  try {
    const dto = (yield call([response, response.json])) as unknown;
    throw createBackendError(response.status, dto, customErrorMap);
  } catch (error) {
    if (error instanceof BackendError) {
      throw error;
    }

    throw new ResponseParseError(
      response.status,
      error instanceof Error ? error.message : 'Failed to parse backend error response'
    );
  }
}

/**
 * Handles successful response parsing
 */
export function* handleSuccessResponse<RES>(
  response: Response
): Generator<unknown, ApiResponse<RES>> {
  // No Content response
  if (response.status === 204) {
    return {
      data: undefined as RES,
      headers: response.headers,
    };
  }

  try {
    const data = (yield call([response, response.json])) as RES;
    return {
      data,
      headers: response.headers,
    };
  } catch (error) {
    throw new ResponseParseError(
      response.status,
      error instanceof Error ? error.message : 'Failed to parse backend successful response'
    );
  }
}
