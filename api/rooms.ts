import { api } from './index';
import { User } from './auth';

export interface Rider {
  id: number,
  createdAt: string,
  updatedAt: string,
  picture: string,
  name: string,
  country: string,
}

export interface Team {
  id: number,
  createdAt: string,
  updatedAt: string,
  user: User
  ridres: Rider[]
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
    getRoomById: builder.query<Room, unknown>({
      query: (id) => `/rooms/${id}`,
    }),
    createRoom: builder.mutation<Room, unknown>({
      query: ({ name, invitations }) => {
        return {
          url: '/rooms',
          method: 'POST',
          body: {
            name,
            invitations
          }
        }
      },
    }),
  }),
});

export const { useCreateRoomMutation, useGetRoomByIdQuery, useGetMyRoomsQuery } = roomsApi;
