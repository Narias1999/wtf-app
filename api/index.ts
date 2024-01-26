import { fetchBaseQuery, createApi, retry } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

const baseUrl = `http://localhost:1337/api`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.jwt;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 })

export const api = createApi({
  reducerPath: 'wtfApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Rooms', 'Invitations', 'Riders'],
  endpoints: () => ({}),
});
