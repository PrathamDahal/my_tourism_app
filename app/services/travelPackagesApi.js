import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../features/baseQuery';

export const travelPackageApi = createApi({
  reducerPath: "travelPackageApi",
  baseQuery,
  tagTypes: ["TravelPackage"],
  endpoints: (builder) => ({
    // Get all travel packages
    getTravelPackages: builder.query({
      query: () => "/travel-packages",
      providesTags: ["TravelPackage"],
    }),

    // Get travel packages created by a specific user
    getTravelPackagesByCreator: builder.query({
      query: (createdById) => `/travel-packages?createdById=${createdById}`,
      providesTags: (result, error, createdById) => [
        { type: "TravelPackage", id: createdById },
      ],
    }),

    // Get travel package by ID
    getTravelPackageById: builder.query({
      query: (id) => `/travel-packages/${id}`,
      providesTags: (result, error, id) => [{ type: "TravelPackage", id }],
    }),

    // Get travel package by slug
    getTravelPackageBySlug: builder.query({
      query: (slug) => `/travel-packages/${slug}`,
      providesTags: (result, error, slug) => [{ type: "TravelPackage", slug }],
    }),

    // Get travel packages by destinationId (relation)
    getTravelPackagesByDestinationId: builder.query({
      query: (destinationId) =>
        `/travel-packages?destinationId=${destinationId}`,
      providesTags: (result, error, destinationId) => [
        { type: "TravelPackage", destinationId },
      ],
    }),

    // Create a new travel package
    createTravelPackage: builder.mutation({
      query: (formData) => ({
        url: "/travel-packages",
        method: "POST",
        body: formData, // can be FormData (for images) or JSON
      }),
      invalidatesTags: ["TravelPackage"],
    }),

    // Update a travel package
    updateTravelPackage: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/travel-packages/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "TravelPackage", id },
      ],
    }),

    // Delete a travel package by slug
    deleteTravelPackage: builder.mutation({
      query: (slug) => ({
        url: `/travel-packages/${slug}`, // use slug here
        method: "DELETE",
      }),
      invalidatesTags: (result, error, slug) => [
        { type: "TravelPackage", id: slug }, // can still use slug as tag
      ],
    }),
  }),
});

export const {
  useGetTravelPackagesQuery,
  useGetTravelPackagesByCreatorQuery,
  useGetTravelPackageByIdQuery,
  useGetTravelPackageBySlugQuery,
  useGetTravelPackagesByDestinationIdQuery,
  useCreateTravelPackageMutation,
  useUpdateTravelPackageMutation,
  useDeleteTravelPackageMutation,
} = travelPackageApi;
