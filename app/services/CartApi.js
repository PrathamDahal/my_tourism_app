import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './../features/baseQuery';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery,
  tagTypes: ['Cart'],

  endpoints: (builder) => ({
    // Fetch all cart items
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),

    // Add an item to the cart
    addToCart: builder.mutation({
      query: (item) => ({
        url: '/cart',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),

    // Update quantity of an item in the cart
    updateCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    // Remove an item from the cart
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // Clear all items from the cart
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
