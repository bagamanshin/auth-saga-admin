import { BackendError } from "@shared/api";

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof BackendError && error.status === 401;
}
