import { api } from './index';
import { User } from './auth';

export interface Rider {
  id: number,
  createdAt: string,
  updatedAt: string,
  picture: string,
  name: string,
  country: string,
  points?: number
}

export interface Team {
  id: number,
  createdAt: string,
  updatedAt: string,
  user: User
  riders: Rider[]
  totalPoints?: number
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
      providesTags: ['Rooms'],
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
      invalidatesTags: ['Rooms']
    }),
    startSeason: builder.mutation<Room, number>({
      query: (id) => {
        return {
          url: `/rooms/${id}`,
          method: 'PUT',
          body: {
            data: {
              started_at: new Date().toISOString()
            }
          }
        }
      },
      invalidatesTags: ['Rooms']
    }),
  }),
});

export const { useCreateRoomMutation, useGetRoomByIdQuery, useGetMyRoomsQuery, useStartSeasonMutation } = roomsApi;
