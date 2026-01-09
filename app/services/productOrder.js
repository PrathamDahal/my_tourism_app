import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./../features/baseQuery";

// API Slice
export const productOrderApi = createApi({
  reducerPath: "productOrderApi",
  baseQuery,
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // POST /api/v1/orders - Create a new order
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    // GET /api/v1/orders - List orders with filters and pagination
    listOrders: builder.query({
      query: (params = {}) => ({
        url: "/orders",
        params: {
          sort: "newest",
          ...params,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.rows.map(({ id }) => ({ type: "Order", id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    // GET /api/v1/orders/code/{code} - Get order by human-readable code
    getOrderByCode: builder.query({
      query: (code) => `/orders/code/${code}`,
      providesTags: (result, error, code) => [{ type: "Order", id: code }],
    }),

    // GET /api/v1/orders/{orderId} - Get order by ID
    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    // PATCH /api/v1/orders/{orderId} - Update order
    updateOrder: builder.mutation({
      query: ({ orderId, body }) => ({
        url: `/orders/${orderId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateOrderMutation,
  useListOrdersQuery,
  useLazyListOrdersQuery,
  useGetOrderByCodeQuery,
  useLazyGetOrderByCodeQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useUpdateOrderMutation,
} = productOrderApi;
