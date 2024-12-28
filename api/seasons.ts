import { BaseResponse } from './baseTypes';
import { api } from './index';

export interface Season {
  id: number,
  year: number,
  active: boolean,
  finished: boolean,
}

export const seasonsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllSeasons: builder.query<Season[], unknown>({
      providesTags: ['Seasons'],
      keepUnusedDataFor: 60000,
      query: () => '/seasons',
      transformResponse: (response: BaseResponse<{ attributes: Season, id: number }[]>) => {
        return response.data.map((season) => season.attributes);
      },
    }),
  }),
});

export const { useGetAllSeasonsQuery } = seasonsApi;
