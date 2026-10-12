import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Branch {
  id: number;
  name: string;
  code: string | null;
  location: string;
  googleMapUrl: string | null;
  openTime: string | null;
  closeTime: string | null;
  is24Hours: boolean;
  weeklyOffDays: string[];
  contactNumber: string;
  whatsappNumber: string | null;
  email: string | null;
  managerName: string | null;
  note: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BranchInput {
  name: string;
  code?: string;
  location: string;
  googleMapUrl?: string;
  openTime?: string;
  closeTime?: string;
  is24Hours: boolean;
  weeklyOffDays: string[];
  contactNumber: string;
  whatsappNumber?: string;
  email?: string;
  managerName?: string;
  note?: string;
}

const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3002';

export const branchesApi = createApi({
  reducerPath: 'branchesApi',
  tagTypes: ['Branches'],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/branches`,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBranches: builder.query<Branch[], void>({ query: () => '', providesTags: ['Branches'] }),
    createBranch: builder.mutation<Branch, BranchInput>({ query: (body) => ({ url: '', method: 'POST', body }), invalidatesTags: ['Branches'] }),
    updateBranch: builder.mutation<Branch, BranchInput & { id: number }>({ query: ({ id, ...body }) => ({ url: `/${id}`, method: 'PATCH', body }), invalidatesTags: ['Branches'] }),
    setBranchStatus: builder.mutation<Branch, { id: number; isActive: boolean }>({ query: ({ id, ...body }) => ({ url: `/${id}/status`, method: 'PATCH', body }), invalidatesTags: ['Branches'] }),
    deleteBranch: builder.mutation<{ success: boolean }, number>({ query: (id) => ({ url: `/${id}`, method: 'DELETE' }), invalidatesTags: ['Branches'] }),
  }),
});

export const { useGetBranchesQuery, useCreateBranchMutation, useUpdateBranchMutation, useSetBranchStatusMutation, useDeleteBranchMutation } = branchesApi;
