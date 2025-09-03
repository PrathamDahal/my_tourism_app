// features/auth/authApiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './../features/baseQuery';

export const registerApiSlice = createApi({
  reducerPath: 'registerApi',
  baseQuery,
  endpoints: (builder) => ({
    createUser: builder.mutation({
      async queryFn(userData, _queryApi, _extraOptions, baseFetch) {
        try {
          const result = await baseFetch({
            url: "/auth/signup",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          if (result.error) {
            // ensure error is serializable
            return { error: { status: result.error.status, data: result.error.data } };
          }

          return { data: result.data };
        } catch (err) {
          // return plain object instead of raw Error
          return { error: { status: "FETCH_ERROR", data: err.message } };
        }
      },
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useCreateUserMutation } = registerApiSlice;
