import { fetchBaseQuery, createApi, retry } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

const baseUrl = `https://fs-node-m1q1.onrender.com/api`;
// const baseUrl = `http://localhost:1337/api`;


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

export const api = createApi({
  reducerPath: 'wtfApi',
  baseQuery: baseQuery,
  tagTypes: ['Rooms', 'Invitations', 'Riders', 'Seasons'],
  endpoints: () => ({}),
});
