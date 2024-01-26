import { BaseResponse } from './baseTypes';
import { api } from './index';
import { Rider } from './rooms';

export const ridersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllRiders: builder.query<BaseResponse<{ attributes: Rider, id: number }[]>, unknown>({
      providesTags: ['Riders'],
      query: () => '/riders',
    }),
  }),
});

export const { useGetAllRidersQuery } = ridersApi;
