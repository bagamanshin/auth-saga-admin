import { DisplayError } from "@shared/api";

export class AuthRequestPreventedError extends DisplayError {
  constructor(message = 'Request was prevented due to invalid token') {
    super(message);
  }

  get displayMessage(): string {
    return this.message;
  }
}