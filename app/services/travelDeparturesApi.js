// services/travelDeparturesApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../features/baseQuery';

export const travelDeparturesApi = createApi({
  reducerPath: "travelDeparturesApi",
  baseQuery,
  endpoints: (builder) => ({
    getPackageDepartures: builder.query({
      query: (slug) => `travel-packages/${slug}/departures`,
    }),
  }),
});

export const { useGetPackageDeparturesQuery } = travelDeparturesApi;
