import { api } from './index';
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
  user_admin?: User,
  started_at: string | null,
  createdAt: string | null,
  updatedAt: string | null,
  finished_at: null,
  teams: Team[]
};


export const roomsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyRooms: builder.query<Room[], unknown>({
      query: () => '/rooms',
    }),
  }),
});

export const { useGetMyRoomsQuery } = roomsApi;
