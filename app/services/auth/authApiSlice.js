// src/features/api/authApiSlice.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../features/baseQuery"; // Your custom baseQuery for RN
import { setCredentials, logout } from "../../features/authSlice"; // Your auth slice

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        const { accessToken, refreshToken } = response;
        return { accessToken, refreshToken };
      },
    }),

    // Refresh token mutation
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const refreshToken = getState().auth.refreshToken;

          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              refreshToken,
            })
          );
        } catch (error) {
          console.error("Refresh token error:", error?.message || error);
          dispatch(logout());
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApiSlice;
