import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];
export const orderStatusLabels: Record<OrderStatus, string> = { PENDING: 'Pending', CONFIRMED: 'Confirmed', PROCESSING: 'Processing', SHIPPED: 'Shipped', DELIVERED: 'Delivered', CANCELLED: 'Cancelled' };
export interface OrderItem { productId: number; name: string; sku: string | null; quantity: number; unitPrice: number; image: string | null }
export interface OrderHistory { id: number; status: OrderStatus; eventType: 'CREATED' | 'STATUS' | 'DETAILS_UPDATED'; note: string | null; changes: { fromStatus?: OrderStatus; fields?: string[]; before?: Record<string, string | null>; after?: Record<string, string | null> } | null; updatedBy: { id: number; name: string | null; email: string } | null; createdAt: string }
export interface ProductOrder { id: number; orderNumber: string; customerName: string; email: string; phone: string | null; address: string; city: string; postalCode: string; items: OrderItem[]; subtotal: string | number; shipping: string | number; tax: string | number; total: string | number; status: OrderStatus; statusNote: string | null; history: OrderHistory[]; createdAt: string; updatedAt: string }
export interface OrderInput { customerName: string; email: string; phone: string; address: string; city: string; postalCode: string; items: { productId: number; quantity: number }[] }

const API_URL = (import.meta.env?.VITE_API_URL ?? 'http://localhost:3002').replace(/\/$/, '');
export const ordersApi = createApi({
  reducerPath: 'ordersApi', tagTypes: ['Orders'], refetchOnFocus: true, refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/api/orders`, prepareHeaders: (headers) => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  } }),
  endpoints: (builder) => ({
    checkoutOrder: builder.mutation<{ orderNumber: string; status: OrderStatus; total: string | number }, OrderInput>({ query: (body) => ({ url: '/checkout', method: 'POST', body }), invalidatesTags: ['Orders'] }),
    getOrders: builder.query<ProductOrder[], void>({ query: () => '', providesTags: ['Orders'] }),
    getOrder: builder.query<ProductOrder, number>({ query: (id) => `/${id}`, providesTags: ['Orders'] }),
    createOrder: builder.mutation<ProductOrder, OrderInput>({ query: (body) => ({ url: '', method: 'POST', body }), invalidatesTags: ['Orders'] }),
    updateOrder: builder.mutation<ProductOrder, { id: number; body: Partial<OrderInput> }>({ query: ({ id, body }) => ({ url: `/${id}`, method: 'PATCH', body }), invalidatesTags: ['Orders'] }),
    updateOrderStatus: builder.mutation<ProductOrder, { id: number; status: OrderStatus; note?: string }>({ query: ({ id, ...body }) => ({ url: `/${id}/status`, method: 'PATCH', body }), invalidatesTags: ['Orders'] }),
    deleteOrder: builder.mutation<{ success: true }, number>({ query: (id) => ({ url: `/${id}`, method: 'DELETE' }), invalidatesTags: ['Orders'] }),
  }),
});
export const { useCheckoutOrderMutation, useGetOrdersQuery, useGetOrderQuery, useCreateOrderMutation, useUpdateOrderMutation, useUpdateOrderStatusMutation, useDeleteOrderMutation } = ordersApi;
