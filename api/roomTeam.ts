import { BaseResponse } from "./baseTypes";
import { api } from "./index";
import { Team } from "./rooms";

interface params {
  id: string;
  data: object;
}

export const roomTeamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateRoomTeam: builder.mutation<
      BaseResponse<{ attributes: Team; id: number }[]>,
      unknown
    >({
      query: ({ id, data }: params) => ({
        url: `/room-teams/${id}`,
        method: 'PUT',
        body: {
          data,
        },
      }),
    }),
  }),
});

export const { useUpdateRoomTeamMutation } = roomTeamApi;
