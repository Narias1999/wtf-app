import { fetchBaseQuery, createApi, retry } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

const baseUrl = `http://localhost:1337/api`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.jwt;
    console.log('token', token)
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 6 })

export const api = createApi({
  reducerPath: 'wtfApi',
  baseQuery: baseQueryWithRetry,
  endpoints: () => ({}),
});
