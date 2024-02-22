import { BaseResponse } from "./baseTypes";
import { api } from "./index";
import { Rider, Team } from "./rooms";

export interface Result {
  id: number,
  attributes: {
    points: number,
    position: number,
    rider: Rider
  }
}

interface params {
  position: number,
  rider: number,
  stage: number
}

export const resultApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createResult: builder.mutation<
      BaseResponse<{ attributes: Result; id: number }[]>,
      unknown
    >({
      query: (data: params) => ({
        url: 'result',
        method: 'POST',
        body: {
          data,
        },
      }),
    }),
  }),
});

export const { useCreateResultMutation } = resultApi;
