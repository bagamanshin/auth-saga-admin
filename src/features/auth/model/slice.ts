import type { LoginCredentials } from '../api/authApi';

// Action Types
export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
export const LOGOUT = 'auth/LOGOUT';

// State
export interface AuthState {
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
};

// Action Interfaces
interface LoginRequestAction {
    type: typeof LOGIN_REQUEST;
    payload: LoginCredentials;
}

interface LoginSuccessAction {
    type: typeof LOGIN_SUCCESS;
}

interface LoginFailureAction {
    type: typeof LOGIN_FAILURE;
    payload: string;
}

interface LogoutAction {
    type: typeof LOGOUT;
}

type AuthAction = LoginRequestAction | LoginSuccessAction | LoginFailureAction | LogoutAction;


// Reducer
export const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, error: null }; // Clear error on success
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
};

// Action Creators
export const loginRequest = (credentials: LoginCredentials) => ({
  type: LOGIN_REQUEST,
  payload: credentials,
});

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS,
});

export const loginFailure = (error: string) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});
