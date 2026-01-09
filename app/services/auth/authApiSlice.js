// src/features/api/authApiSlice.js
import { createApi } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseQuery } from './../../features/baseQuery';
import { setCredentials } from "../../features/authSlice";

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, refreshToken } = data;

          dispatch(setCredentials({ accessToken, refreshToken }));
          await AsyncStorage.setItem("accessToken", accessToken);
          await AsyncStorage.setItem("refreshToken", refreshToken);
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    checkEmail: builder.query({
      query: (email) => ({
        url: `/Auth/check-email?email=${encodeURIComponent(email)}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useLazyCheckEmailQuery } = authApiSlice;