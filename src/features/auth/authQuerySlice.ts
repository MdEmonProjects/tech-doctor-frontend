import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthUser } from './authSlice';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3002';

export const authQuerySlice = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Session'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Session'],
    }),
    me: builder.query<AuthUser, void>({ query: () => '/auth/me', providesTags: ['Session'] }),
  }),
});

export const { useLoginMutation, useMeQuery } = authQuerySlice;
