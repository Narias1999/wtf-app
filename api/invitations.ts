import { BaseResponse } from './baseTypes';
import { api } from './index';
import { Room } from './rooms';


export interface Invitation {
  id:         number;
  email:       string;
  room: Room
  accepted_at: null;
  rejected_at: null;
  createdAt:   Date;
  updatedAt:   Date;
}

interface updateInvitation {
  id: number,
  accept: boolean
}


export const invitationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyInvitations: builder.query<BaseResponse<Invitation[]>, unknown>({
      query: () => ({
        url: '/invitations',
        params: {
          'filters[accepted_at][$null]': true,
          'filters[rejected_at][$null]': true
        }
      }),
    }),
    updateInvitation: builder.mutation<BaseResponse<Invitation>, unknown>({
      query: ({ id, accept }: updateInvitation) => {
        let data = {}
        if(accept) {
          data = {
            accepted_at: (new Date()).toISOString()
          }
        } else {
          data = {
            rejected_at: (new Date()).toISOString()
          }
        }
        return {
          url: `/invitations/${id}`,
          method: "PUT",
          body: {
            populate: ['room'],
            data
          }
        }
      },
    }),
  }),
});

export const { useGetMyInvitationsQuery, useUpdateInvitationMutation } = invitationsApi;
