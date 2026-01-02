import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../features/baseQuery';

export const destinationApi = createApi({
  reducerPath: "destinationApi",
  baseQuery,
  tagTypes: ["Destinations"],
  endpoints: (builder) => ({
    getAllDestinations: builder.query({
      query: () => "/destinations",
      providesTags: ["Destinations"],
    }),
    getPublishedDestinations: builder.query({
      query: () => "/destinations?published=true",
      providesTags: ["Destinations"],
    }),
    getDestinationBySlug: builder.query({
      query: (slug) => `/destinations/${slug}`, 
      providesTags: (result, error, slug) => [
        { type: "Destinations", id: slug },
      ],
    }),
  }),
});

export const {
  useGetAllDestinationsQuery,
  useGetPublishedDestinationsQuery,
  useGetDestinationBySlugQuery,
} = destinationApi;
