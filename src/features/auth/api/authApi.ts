import { request } from '@shared/api';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  access_expired_at: number;
  refresh_expired_at: number;
};

export type AuthErrorResponse = {
  name: string;
  message: string;
  code: number;
  status: number;
  type: string;
};

export type AuthValidationErrorResponse = {
  field: string;
  message: string;
}[];

export type LoginRequestError = AuthErrorResponse | AuthValidationErrorResponse;

export const loginApi = (credentials: LoginRequest) => {
  return request<LoginRequest, LoginResponse, LoginRequestError>('/auth/token-generate', {
    method: 'POST',
    body: credentials,
    isAuth: false,
  });
};

export const refreshTokenApi = (refreshToken: string) => {
  return request<{ refresh: string }, { access_token: string }, AuthErrorResponse>(
    'token/refresh/',
    {
      method: 'POST',
      body: { refresh: refreshToken },
      isAuth: false,
    }
  );
};
