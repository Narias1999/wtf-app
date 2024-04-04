import { BaseResponse } from "./baseTypes";
import { api } from "./index";
import { Rider, Team } from "./rooms";

export interface Result {
  id: number,
  attributes: {
    points: number,
    position: number,
    rider: {
      data: {
        attributes: Rider,
        id: number
      }
    }
  }
}

interface params {
  position: number,
  rider: number,
  stage: number
}

export interface TeamResult {
  totalPoints?: number,
  riders: Rider[]
}

export const resultApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createResult: builder.mutation<
      BaseResponse<{ attributes: Result; id: number }[]>,
      unknown
    >({
      query: (data: params) => ({
        url: 'results',
        method: 'POST',
        body: {
          data,
        },
      }),
    }),
    getTeamResult: builder.mutation<
      BaseResponse<TeamResult>,
      unknown
    >({
      query: (teamId: number) => ({
        url: `results/team-result/${teamId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useCreateResultMutation, useGetTeamResultMutation } = resultApi;
