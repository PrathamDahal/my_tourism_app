import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../features/baseQuery';

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery,
  tagTypes: ["Reviews"], // used for automatic refetching
  endpoints: (builder) => ({
    // GET: Fetch reviews by type and ID
    getReviews: builder.query({
      query: ({ type, id }) => `/${type}/${id}/reviews`,
      transformResponse: (response) => {
        if (!Array.isArray(response)) return [];
        return response.map((review) => ({
          id: review.id,
          name: `${review.user.firstName} ${review.user.lastName}`,
          reviews: review.rating,
          comment: review.comment,
          image: review.user.images,
          userId: review.user.id,
        }));
      },
      providesTags: ["Reviews"],
    }),

    // POST: Add a new review
    addReview: builder.mutation({
      query: ({ type, id, ...rest }) => ({
        url: `/reviews`,
        method: "POST",
        body: {
          targetType: type,
          targetId: id,
          ...rest, // rating, comment
        },
      }),
      invalidatesTags: ["Reviews"],
    }),

    // PATCH: Edit an existing review by reviewId
    editReview: builder.mutation({
      query: ({ reviewId, ...body }) => ({
        url: `/reviews/${reviewId}`,
        method: "PATCH",
        body, // expects: { rating, comment }
      }),
      invalidatesTags: ["Reviews"],
    }),

    // DELETE: Delete a review by reviewId
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),

    // GET: Fetch average rating and review count
    getAverageReview: builder.query({
      query: ({ type, id }) => `/${type}/${id}/reviews/average`,
      transformResponse: (response) => ({
        average: response.average,
        count: response.count,
      }),
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useAddReviewMutation,
  useGetAverageReviewQuery,
  useEditReviewMutation,
  useDeleteReviewMutation,
} = feedbackApi;
