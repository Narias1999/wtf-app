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
    getRaces: builder.query<BaseResponse<Race[]>, unknown>({
      query: () => ({
        url: "/races",
        params: {
          "pagination[pageSize]": 400,
          "populate[stages][populate][results][populate][rider]": true
        },
      }),
    }),
    getSimpleRaces: builder.query<BaseResponse<Race[]>, unknown>({
      query: () => ({
        url: "/races",
        params: {
          "pagination[pageSize]": 400,
          "populate[stages]": true
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
  useGetRacesQuery,
  useGetRaceWithStagesQuery,
  useGetSimpleRacesQuery
} = racersApi;
