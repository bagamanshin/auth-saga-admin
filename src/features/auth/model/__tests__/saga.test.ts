import { testSaga } from 'redux-saga-test-plan';
import { push } from 'connected-react-router';
import { loginWorker } from '../saga';
import { loginApi, LoginCredentials, LoginResponse } from '../../api/authApi';
import { loginSuccess, loginFailure } from '../slice';
import * as cookieHelpers from '@shared/lib/cookies';

describe('authSaga - loginWorker', () => {
  const credentials: LoginCredentials = { username: 'test', password: 'password' };
  const action = { type: 'auth/LOGIN_REQUEST', payload: credentials };

  it('should call loginApi and dispatch success on successful login', () => {
    const response: { data: LoginResponse } = {
      data: {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        user: { id: 1, username: 'test' },
      },
    };

    // Mocking the setCookie function
    const setCookieSpy = jest.spyOn(cookieHelpers, 'setCookie');

    testSaga(loginWorker, action)
      .next()
      .call(loginApi, credentials)
      .next(response)
      .call(cookieHelpers.setCookie, '_auth', 'access_token', { 'max-age': 3600 })
      .next()
      .call(cookieHelpers.setCookie, '_auth_refresh', 'refresh_token', { 'max-age': 86400 })
      .next()
      .put(loginSuccess())
      .next()
      .put(push('/'))
      .next()
      .isDone();
    
    expect(setCookieSpy).toHaveBeenCalledTimes(2);
    setCookieSpy.mockRestore();
  });

  it('should dispatch failure on failed login', () => {
    const error = new Error('Login failed');

    testSaga(loginWorker, action)
      .next()
      .call(loginApi, credentials)
      .throw(error)
      .put(loginFailure(error.message))
      .next()
      .isDone();
  });
});
