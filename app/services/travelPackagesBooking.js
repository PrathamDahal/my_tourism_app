import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './../features/baseQuery';

export const packageBookingApi = createApi({
  reducerPath: "packageBookingApi",
  baseQuery,
  tagTypes: ["PackageBooking"],
  endpoints: (builder) => ({
    // POST /api/v1/bookings - Create a new booking
    createPackageBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: [{ type: "PackageBooking", id: "LIST" }],
    }),

    // GET /api/v1/bookings - Get all bookings
    getPackageBookings: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/bookings${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "PackageBooking", id })),
              { type: "PackageBooking", id: "LIST" },
            ]
          : [{ type: "PackageBooking", id: "LIST" }],
    }),

    // GET /api/v1/bookings/agency - Get agency bookings
    getAgencyBookings: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/bookings/agency${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "PackageBooking", id })),
              { type: "PackageBooking", id: "AGENCY" },
            ]
          : [{ type: "PackageBooking", id: "AGENCY" }],
    }),

    // GET /api/v1/bookings/{id} - Get a single booking by ID
    getPackageBookingById: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: "PackageBooking", id }],
    }),

    // PATCH /api/v1/bookings/{id}/travellers - Update travellers
    updateBookingTravellers: builder.mutation({
      query: ({ id, travellers }) => ({
        url: `/bookings/${id}/travellers`,
        method: "PATCH",
        body: { travellers },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PackageBooking", id },
        { type: "PackageBooking", id: "LIST" },
      ],
    }),

    // PATCH /api/v1/bookings/{id}/status - Update booking status
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PackageBooking", id },
        { type: "PackageBooking", id: "LIST" },
        { type: "PackageBooking", id: "AGENCY" },
      ],
    }),
  }),
});

export const {
  useCreatePackageBookingMutation,
  useGetPackageBookingsQuery,
  useGetAgencyBookingsQuery,
  useGetPackageBookingByIdQuery,
  useUpdateBookingTravellersMutation,
  useUpdateBookingStatusMutation,
} = packageBookingApi;