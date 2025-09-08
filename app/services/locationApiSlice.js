import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../features/baseQuery';

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery,
  endpoints: (builder) => ({
    sendPing: builder.mutation({
      query: ({ lat, lng, speed, heading }) => ({
        url: "/location/ping",
        method: "POST",
        body: { lat, lng, speed, heading },
      }),
    }),
    fetchTrail: builder.query({
      query: ({ windowHours = 1, step }) =>
        `/location/trail?windowHours=${windowHours}${step ? `&step=${step}` : ""}`,
    }),
    fetchNow: builder.query({
      query: () => "/location/now",
    }),
    fetchActive: builder.query({
      query: ({ windowMinutes = 10, limit = 500 }) =>
        `/location/active?windowMinutes=${windowMinutes}&limit=${limit}`,
    }),
    fetchSOS: builder.query({
      query: () => "/location/sos",
    }),
    createSOS: builder.mutation({
      query: ({ lat, lng, note }) => ({
        url: "/location/sos",
        method: "POST",
        body: { lat, lng, note },
      }),
    }),
    updateSOS: builder.mutation({
      query: ({ id, status }) => ({
        url: `/location/sos/${id}`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useSendPingMutation,
  useFetchTrailQuery,
  useFetchNowQuery,
  useFetchActiveQuery,
  useFetchSOSQuery,
  useCreateSOSMutation,
  useUpdateSOSMutation,
} = locationApi;
