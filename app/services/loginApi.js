import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../features/baseQuery"; // Import the custom baseQuery
import { setCredentials, logout } from "./auth/authSlice"; // Import Redux actions

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery, // Use the custom baseQuery
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login", // Specific endpoint for login
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        const { accessToken, refreshToken } = response.data;
        return { accessToken, refreshToken };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Dispatch the setCredentials action to update the Redux store
          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            })
          );
        } catch (error) {
          console.error("Login error:", error.message || error);
        }
      },
    }),

    // Refresh token endpoint
    refreshToken: builder.mutation({
      query: () => ({
        url: "/token/refreshToken", // Specific endpoint for refreshing the token
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          // Get the current refreshToken from the Redux store
          const refreshToken = getState().auth.refreshToken;
          // Dispatch the setCredentials action to update the Redux store
          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              refreshToken: refreshToken,
            })
          );
        } catch (error) {
          console.error("Refresh token error:", error.message || error);
          // Logout the user if the refresh token fails
          dispatch(logout());
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useLogoutMutation } =
  authApiSlice;
