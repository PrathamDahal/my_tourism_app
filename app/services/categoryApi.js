import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../features/baseQuery';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery,
  tagTypes: ['Category', 'CategoryProducts'],
  endpoints: (builder) => ({
    // GET all categories
    getCategories: builder.query({
      query: () => '/productcategories',
      providesTags: ['Category'],
    }),

    // GET a specific category by name
    getCategoryBySlug: builder.query({
      query: (slug) => `/productcategories/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Category', slug }],
    }),

    // GET all products inside a specific category
    getCategoryProducts: builder.query({
      query: (categoryId) => `/productcategories/${categoryId}`,
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
        url: '/productcategories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),

    // UPDATE a category
    updateCategory: builder.mutation({
      query: ({ id, ...updatedCategory }) => ({
        url: `/productcategories/${id}`,
        method: 'PATCH',
        body: updatedCategory,
      }),
      invalidatesTags: ['Category'],
    }),

    // DELETE a category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/productcategories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetCategoryProductsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;