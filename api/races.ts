import { BaseResponse } from "./baseTypes";
import { api } from "./index";
import { Stage } from "./stages";

export interface Race {
  id: number;
  attributes: {
    Name: string;
    slug: string;
    location: string;
    stages: {
      data: Stage[];
    };
  };
}

export interface RaceSimple {
  Name: string;
  slug: string;
  location: string;
  stages: Stage[];
  id: number;

}

export const racersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRaces: builder.query<BaseResponse<Race[]>, number | null | undefined>({
      query: (year) => {
        const params: Record<string, any> = {
          "pagination[pageSize]": 400,
          "populate[stages][populate][results][populate][rider]": true
        }
        if(year) {
          params['filters[stages][year][$eq]'] = year
        }
        return {
          url: "/races",
          params,
        }
      },
    }),
    getSimpleRaces: builder.query<BaseResponse<Race[]>, number | null | undefined>({
      query: (year) => ({
        url: "/races",
        params: {
          "pagination[pageSize]": 400,
          "populate[stages]": true,
          "filters[stages][year][$eq]": year
        },
      }),
    }),
    getRaceWithStages: builder.query<RaceSimple, number>({
      query: (id) => ({
        url: `/races/${id}/results`,
      }),
    }),
  }),
});

export const {
  useLazyGetRacesQuery,
  useGetRaceWithStagesQuery,
  useLazyGetSimpleRacesQuery
} = racersApi;
