import { BaseResponse } from './baseTypes';
import { api } from './index';
import { Race } from './races';
import { Result } from './results';
import { Rider } from './rooms';

export interface Stage {
  id: number,
  number: number,
  year: number,
  distance: number,
  start_location: string
  end_location: string,
  terrain: string,
  date: string
  results: {
    data: Result[]
  },
  race: {
    data: Race
  }
}

export const racersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStage: builder.query<BaseResponse<Stage>, unknown>({
      query: (id) => ({
        url: `/stages/${id}`,
        params: {
          'populate[results][populate][rider]': true,
          'populate[race]': true

        }
      }),
    }),
  }),
});

export const { useGetStageQuery } = racersApi;
