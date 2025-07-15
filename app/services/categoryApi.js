import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../features/baseQuery';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery,
  tagTypes: ['Category', 'CategoryProducts'],
  endpoints: (builder) => ({
    // GET all categories
    getCategories: builder.query({
      query: () => '/seller-categories',
      providesTags: ['Category'],
    }),

    // GET a specific category by ID
    getCategoryById: builder.query({
      query: (id) => `/seller-categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // GET all products inside a specific category
    getCategoryProducts: builder.query({
      query: (categoryId) => `/seller-categories/${categoryId}`,
      providesTags: (result, error, categoryId) => [
        { type: 'CategoryProducts', id: categoryId },
        ...(result?.products?.map(({ id }) => ({ type: 'CategoryProducts', id })) || []),
      ],
      transformResponse: (response) => {
        return response.products || [];
      },
    }),

    // CREATE a new category
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: '/seller-categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),

    // UPDATE a category
    updateCategory: builder.mutation({
      query: ({ id, ...updatedCategory }) => ({
        url: `/seller-categories/${id}`,
        method: 'PATCH',
        body: updatedCategory,
      }),
      invalidatesTags: ['Category'],
    }),

    // DELETE a category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/seller-categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryProductsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;