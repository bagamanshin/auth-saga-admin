import { request } from '@shared/api';
import type {
  LoginRequest,
  LoginResponse,
  LoginRequestError,
} from '@shared/api/authApi';

export const loginApi = (payload: LoginRequest) => {
  return request<LoginRequest, LoginResponse, LoginRequestError>('/auth/token-generate', {
    method: 'POST',
    body: payload,
    isAuth: false,
  });
};
