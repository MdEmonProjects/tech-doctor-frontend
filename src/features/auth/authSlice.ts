import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole = string;

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  roleId: number;
  roleName: string;
  permissions: string[];
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginSuccessPayload {
  user: AuthUser;
  accessToken: string;
}

const storage = typeof window !== 'undefined' ? window.localStorage : null;
let storedUser: string | null = null;
let storedToken: string | null = null;

try {
  storedUser = storage?.getItem('auth_user') ?? null;
  storedToken = storage?.getItem('access_token') ?? null;
} catch {
  // Storage may be unavailable in private browsing or server rendering.
}

let initialUser: AuthUser | null = null;
try {
  initialUser = storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
} catch {
  // Invalid persisted state is treated as a signed-out session.
}

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: Boolean(initialUser && storedToken),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      storage?.setItem('auth_user', JSON.stringify(action.payload.user));
      storage?.setItem('access_token', action.payload.accessToken);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    syncUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.error = null;
      storage?.setItem('auth_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      storage?.removeItem('auth_user');
      storage?.removeItem('access_token');
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, syncUser, logout } = authSlice.actions;
export default authSlice.reducer;
