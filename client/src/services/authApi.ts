import { baseApi } from './baseApi';
import { AuthResponse, User } from '../types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    registration: builder.mutation<AuthResponse, any>({
      query: (credentials) => ({
        url: '/auth/registration',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
    }),
    refresh: builder.query<AuthResponse, void>({
      query: () => '/auth/refresh',
    }),
  }),
});

export const {
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
  useRefreshQuery,
} = authApi;
