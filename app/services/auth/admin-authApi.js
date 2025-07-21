// src/services/protectedApi.js

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../features/baseQuery'; // Ensure this works for React Native too

export const protectedApi = createApi({
  reducerPath: 'protectedApi',
  baseQuery,
  endpoints: (builder) => ({
    checkAdminAuth: builder.query({
      query: () => '/auth/admin-auth',
    }),
  }),
});

export const { useCheckAdminAuthQuery } = protectedApi;
