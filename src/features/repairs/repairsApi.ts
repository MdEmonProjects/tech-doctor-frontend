import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const REPAIR_STATUSES = [
  'PENDING', 'CONFIRMED', 'DIAGNOSING', 'IN_REPAIR', 'QUALITY_CHECK',
  'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED',
] as const;

export type RepairStatus = typeof REPAIR_STATUSES[number];

export const REPAIR_STATUS_LABELS: Record<RepairStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  DIAGNOSING: 'Diagnosing',
  IN_REPAIR: 'In repair',
  QUALITY_CHECK: 'Quality check',
  READY_FOR_PICKUP: 'Ready for pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export interface RepairBranchOption { id: number; name: string; code: string | null; location: string; }
export interface RepairHistory { id: number; status: RepairStatus; note: string | null; createdAt: string; }
export interface RepairTicket {
  id: number;
  ticketId: string;
  customerName: string;
  phone?: string;
  email?: string | null;
  brand: string;
  model: string;
  service: string;
  branchId: number | null;
  serviceMode?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  customerNotes?: string | null;
  branch: RepairBranchOption | null;
  status: RepairStatus;
  statusNote: string | null;
  estimatedCompletion: string | null;
  createdAt: string;
  updatedAt: string;
  history: RepairHistory[];
}

export interface CreateRepairInput {
  customerName: string;
  phone: string;
  email?: string;
  brand: string;
  model: string;
  service: string;
  branchId?: number;
  serviceMode?: 'in-store' | 'courier-pickup' | 'mail-in';
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3002';

export const repairsApi = createApi({
  reducerPath: 'repairsApi',
  tagTypes: ['Repairs'],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/repairs`,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRepairs: builder.query<RepairTicket[], void>({ query: () => '', providesTags: ['Repairs'] }),
    getRepairBranches: builder.query<RepairBranchOption[], void>({ query: () => '/branches' }),
    trackRepair: builder.query<RepairTicket, string>({ query: (ticketId) => `/track/${encodeURIComponent(ticketId)}` }),
    createRepair: builder.mutation<RepairTicket, CreateRepairInput>({
      query: (body) => ({ url: '', method: 'POST', body }),
      invalidatesTags: ['Repairs'],
    }),
    updateRepairStatus: builder.mutation<RepairTicket, { id: number; status: RepairStatus; note?: string; estimatedCompletion?: string }>({
      query: ({ id, ...body }) => ({ url: `/${id}/status`, method: 'PATCH', body }),
      invalidatesTags: ['Repairs'],
    }),
  }),
});

export const {
  useGetRepairsQuery, useGetRepairBranchesQuery, useLazyTrackRepairQuery,
  useCreateRepairMutation, useUpdateRepairStatusMutation,
} = repairsApi;
