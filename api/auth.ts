import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseUrl from './index';

export interface User {
  id: number,
  username: string,
  email: string,
  provider: string,
  confirmed: boolean,
  blocked: boolean,
  createdAt: Date,
  updatedAt: Date
};

interface AuthResponse {
  jwt: string;
  user: User;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, unknown>({
      query: (body: { identifier: string, password: string }) => {
        return {
          url: 'auth/local',
          method: 'POST',
          body
        }
      }
    }),
    register: builder.mutation<AuthResponse, unknown>({
      query: ({ username, email, password }) => {
        return {
          url: 'auth/local/register',
          method: 'POST',
          body: {
            username,
            email,
            password,
          }
        }
      }
    }),
  }),
});



export const { useLoginMutation, useRegisterMutation } = authApi;
