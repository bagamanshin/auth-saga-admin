export interface ApiGeneralErrorResponseDTO {
  name: string;
  message: string;
  code: number;
  status: number;
  type: string;
}

export interface ApiInternalServerErrorResponseDTO {
  reason: string;
}

export interface ApiNotAuthorizedErrorResponseDTO {
  reason: string;
}

export type ApiFormValidationErrorResponseDTO = {
  field: string;
  message: string;
}[];

export abstract class DisplayError extends Error {
  readonly isDisplayError = true;

  constructor(message?: string) {
    super(message);
  }

  abstract get displayMessage(): string;
}

export interface BackendErrorParams<T> {
  dto: T;
  status: number;
}

export abstract class BackendError<P = unknown> extends DisplayError {
  dto: P;
  status: number;

  constructor({status, dto}: BackendErrorParams<P>) {
    super();
    this.dto = dto;
    this.status = status;
  }
}  

type BivariantThisFunction<This, Args extends unknown[], ReturnType> = {
  bivarianceHack(this: This, ...args: Args): ReturnType;
}['bivarianceHack'];

export type BackendErrorMessageBuilder<P = unknown> = BivariantThisFunction<
  BackendError<P>,
  [dto?: P],
  string
>;

interface CustomBackendErrorParams<P> extends BackendErrorParams<P> {
  getDisplayMessage: BackendErrorMessageBuilder<P>;
}

export class CustomBackendError<P = unknown> extends BackendError<P> {
  private readonly displayMessageBuilder: BackendErrorMessageBuilder<P>;

  constructor({ status, dto, getDisplayMessage }: CustomBackendErrorParams<P>) {
    super({ status, dto });
    this.displayMessageBuilder = getDisplayMessage;
  }

  get displayMessage(): string {
    return this.displayMessageBuilder.call(this, this.dto);
  }
}

export class BackendGeneralError extends BackendError<ApiGeneralErrorResponseDTO> {  
  get displayMessage(): string {
    return this.dto.message;
  }
}

export class BackendFormValidationError extends BackendError<ApiFormValidationErrorResponseDTO>  {
  get displayMessage(): string {
    return this.dto
        .map(error => `${error.field}: ${error.message}`)
        .join('\n');
  }
}

export class NotAuthorizedBackendError extends BackendError<ApiNotAuthorizedErrorResponseDTO> {
  get displayMessage(): string {
    return this.dto.reason;
  }
}
export class InternalBackendError extends BackendError<ApiInternalServerErrorResponseDTO> {
  get displayMessage(): string {
    return this.dto.reason;
  }
}

export class UnknownBackendError extends BackendError<unknown> {
  get displayMessage(): string {
    return `Status ${this.status}: - ${JSON.stringify(this.dto, null, 2)}`;
  }
}

export class NetworkError extends DisplayError {
  constructor(message = 'Network error default message') {
    super(message);
  }

  get displayMessage(): string {
    return this.message;
  }
}

export class AbortRequestError extends DisplayError {
  constructor(message = 'Request was aborted') {
    super(message);
  }

  get displayMessage(): string {
    return this.message;
  }
}

export class ResponseParseError extends DisplayError {
  status: number;

  constructor(status: number, message = 'Default error message: failed to parse response') {
    super(message);
    this.status = status;
  }

  get displayMessage(): string {
    return `Status ${this.status}: ${this.message}`;
  }
}

export const isDisplayError = (error: unknown): error is DisplayError => {
  return error instanceof DisplayError;
};
