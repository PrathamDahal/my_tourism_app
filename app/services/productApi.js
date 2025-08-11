import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../features/baseQuery';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query({
      query: () => '/products',
      providesTags: ['Product'],
    }),

    // Get products by user ID
    getProductsByUserId: builder.query({
      query: (userId) => `/products/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Product', userId }],
    }),

    // Get products by category name
    getProductsByCategory: builder.query({
      query: (slug) => `/products?category=${slug}`,
      providesTags: (result, error, slug) => [
        { type: 'Product', slug },
      ],
    }),

    // Get a single product by slug
    getProductBySlug: builder.query({
      query: (slug) => `/products/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Product', slug }],
    }),

    // Create a new product
    createProduct: builder.mutation({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
        // For React Native, we handle FormData differently
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['Product'],
    }),

    // Update an existing product
    updateProduct: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),

    // Delete a product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetProductsQuery,
  useGetProductsByUserIdQuery,
  useGetProductsByCategoryQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;