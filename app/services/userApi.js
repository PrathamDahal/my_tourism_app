import { createApi } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../features/authSlice";
import { baseQuery } from '../features/baseQuery';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  endpoints: (builder) => ({
    fetchUserProfile: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, baseFetch) {
        try {
          const accessToken = await AsyncStorage.getItem("accessToken");

          if (!accessToken) {
            throw new Error("Access token is required");
          }

          const result = await baseFetch({
            url: "/user/profile",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (result.error) {
            throw result.error;
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },

      transformResponse: (response) => response.data,

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user }));
        } catch (error) {
          // Error silently ignored
        }
      },
    }),
  }),
});

export const { useFetchUserProfileQuery } = userApi;
