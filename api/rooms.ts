import { createApi } from '@reduxjs/toolkit/query/react';
import { authenticatedBaseQuery } from './index';
import { User } from './auth';

export interface Team {
  id: number,
  createdAt: string,
  updatedAt: string,
  user: User
}

export interface Room {
  id: number,
  name: string,
  started_at: string | null,
  createdAt: string | null,
  updatedAt: string | null,
  finished_at: null,
  teams: Team[]
};


export const roomsApi = createApi({
  reducerPath: 'authApi',
  baseQuery: authenticatedBaseQuery,
  endpoints: (builder) => ({
    getMyRooms: builder.query<Room[], unknown>({
      query: () => '/rooms',
    }),
  }),
});



export const { useGetMyRoomsQuery } = roomsApi;
