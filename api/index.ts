import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from '../store';

const ip = '192.168.39.106';

const baseUrl = `http://${ip}:1337/api`;

export default baseUrl;


export const authenticatedBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.jwt;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});