import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../../features/baseQuery';

export const privacyApi = createApi({
  reducerPath: "privacyApi",
  baseQuery,
  endpoints: (builder) => ({
    getPrivacy: builder.query({
      query: () => "/privacy/me",
    }),
    consent: builder.mutation({
      query: () => ({ url: "/privacy/consent", method: "POST" }),
    }),
    pause: builder.mutation({
      query: () => ({ url: "/privacy/pause", method: "POST" }),
    }),
    resume: builder.mutation({
      query: () => ({ url: "/privacy/resume", method: "POST" }),
    }),
    deleteTrail: builder.mutation({
      query: ({ from, to }) => ({
        url: `/privacy/trail?from=${from}&to=${to}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetPrivacyQuery,
  useConsentMutation,
  usePauseMutation,
  useResumeMutation,
  useDeleteTrailMutation,
} = privacyApi;
