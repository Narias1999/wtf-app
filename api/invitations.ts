import { api } from './index';
import { Room } from './rooms';

export interface Invitation {
  id: number,
  room: Room
};



export const invitationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyInvitations: builder.query<Room[], unknown>({
      query: () => '/invitations',
    }),
  }),
});

export const { useGetMyInvitationsQuery } = invitationsApi;
