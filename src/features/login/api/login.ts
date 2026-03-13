import type {
  LoginRequestDTO,
  LoginResponseDTO,
} from '../model/saga';
import { request, type ApiResponse } from '@shared/api';
import { call } from 'redux-saga/effects';

export function* loginApi(
  payload: LoginRequestDTO
): Generator<unknown, ApiResponse<LoginResponseDTO>> {
  return (yield call(
    request<LoginRequestDTO, LoginResponseDTO>,
    '/auth/token-generate',
    {
      method: 'POST',
      body: payload,
    }
  )) as ApiResponse<LoginResponseDTO>;
}
