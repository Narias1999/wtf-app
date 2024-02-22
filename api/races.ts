import { BaseResponse } from './baseTypes';
import { api } from './index';
import { Result } from './results';
import { Rider } from './rooms';

export interface Race {
  id: number,
  attributes: {
    Name: string,
    slug: string,
    location: string,
    stages: {
      data: Stage[]
    }
  }
}

export interface Stage {
  id: number,
  attributes: {
    number: number,
    year: number,
    distance: number,
    start_location: string
    end_location: string,
    terrain: string,
    date: Date
    results: {
      data: Result[]
    }
  }
}

export const racersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRaces: builder.query<BaseResponse<Race[]>, unknown>({
      query: () => ({
        url: '/races',
        params: {
          'pagination[pageSize]': 400,
          'populate[stages][populate][results][populate][rider]': true
        }
      }),
    }),
  }),
});

export const { useGetRacesQuery } = racersApi;
