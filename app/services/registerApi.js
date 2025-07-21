// features/auth/authApiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './../features/baseQuery';

export const registerApiSlice = createApi({
  reducerPath: 'registerApi',
  baseQuery,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData
      })
    })
  })
});

export const { useRegisterUserMutation } = registerApiSlice;