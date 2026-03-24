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
} from './errors';
import type { ApiResponse, BackendErrorMap } from './types';

type BackendErrorConstructor = new (
  params: BackendErrorParams<unknown>
) => BackendError;

const defaultBackendErrorMap: {
  fallback: BackendErrorConstructor;
} & Record<number, BackendErrorConstructor> = {
  400: BackendGeneralError as unknown as BackendErrorConstructor,
  401: NotAuthorizedBackendError as unknown as BackendErrorConstructor,
  404: BackendGeneralError as unknown as BackendErrorConstructor,
  422: BackendFormValidationError as unknown as BackendErrorConstructor,
  500: InternalBackendError as unknown as BackendErrorConstructor,
  fallback: UnknownBackendError as unknown as BackendErrorConstructor,
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
    dto,
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
