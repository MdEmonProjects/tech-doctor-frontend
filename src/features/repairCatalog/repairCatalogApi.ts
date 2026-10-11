import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CatalogService {
  id: number;
  price: string | number | null;
  service: { id: number; name: string; description: string | null; estimatedTime: string | null; warranty: string | null };
}
export interface CatalogModel { id: number; name: string; deviceType: string; services: CatalogService[]; }
export interface CatalogBrand { id: number; name: string; models: CatalogModel[]; }
export interface CreateDeviceCatalogInput {
  brandName: string; modelName: string; deviceType: string; serviceName: string;
  estimatedTime?: string; warranty?: string; description?: string; price?: number;
}
export interface RepairServiceOption { id: number; name: string; description: string | null; estimatedTime: string | null; warranty: string | null; }
export interface ServiceDetails { name: string; description?: string; estimatedTime?: string; warranty?: string; }
export interface ModelDetails { name: string; deviceType: string; services: { serviceId: number; price?: number }[]; }

const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3002';

export const repairCatalogApi = createApi({
  reducerPath: 'repairCatalogApi',
  tagTypes: ['RepairCatalog'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRepairCatalog: builder.query<CatalogBrand[], void>({
      query: () => '/repair-catalog',
      providesTags: ['RepairCatalog'],
    }),
    createDeviceCatalog: builder.mutation<CatalogService, CreateDeviceCatalogInput>({
      query: (body) => ({ url: '/repair-catalog/devices', method: 'POST', body }),
      invalidatesTags: ['RepairCatalog'],
    }),
    getRepairServices: builder.query<RepairServiceOption[], void>({
      query: () => '/repair-catalog/services',
      providesTags: ['RepairCatalog'],
    }),
    createRepairBrand: builder.mutation<CatalogBrand, { name: string }>({
      query: (body) => ({ url: '/repair-catalog/brands', method: 'POST', body }),
      invalidatesTags: ['RepairCatalog'],
    }),
    addModelServices: builder.mutation<CatalogModel, ModelDetails & { brandId: number }>({
      query: ({ brandId, ...body }) => ({ url: `/repair-catalog/brands/${brandId}/models`, method: 'POST', body }),
      invalidatesTags: ['RepairCatalog'],
    }),
    updateRepairModel: builder.mutation<CatalogModel, ModelDetails & { modelId: number }>({
      query: ({ modelId, ...body }) => ({ url: `/repair-catalog/models/${modelId}`, method: 'PATCH', body }),
      invalidatesTags: ['RepairCatalog'],
    }),
    deleteRepairModel: builder.mutation<{ success: boolean }, number>({
      query: (modelId) => ({ url: `/repair-catalog/models/${modelId}`, method: 'DELETE' }),
      invalidatesTags: ['RepairCatalog'],
    }),
    createRepairService: builder.mutation<RepairServiceOption, ServiceDetails>({
      query: (body) => ({ url: '/repair-catalog/services', method: 'POST', body }),
      invalidatesTags: ['RepairCatalog'],
    }),
    updateRepairService: builder.mutation<RepairServiceOption, ServiceDetails & { serviceId: number }>({
      query: ({ serviceId, ...body }) => ({ url: `/repair-catalog/services/${serviceId}`, method: 'PATCH', body }),
      invalidatesTags: ['RepairCatalog'],
    }),
    deleteRepairService: builder.mutation<{ success: boolean }, number>({
      query: (serviceId) => ({ url: `/repair-catalog/services/${serviceId}`, method: 'DELETE' }),
      invalidatesTags: ['RepairCatalog'],
    }),
  }),
});

export const { useGetRepairCatalogQuery, useGetRepairServicesQuery, useCreateDeviceCatalogMutation, useCreateRepairBrandMutation, useAddModelServicesMutation, useUpdateRepairModelMutation, useDeleteRepairModelMutation, useCreateRepairServiceMutation, useUpdateRepairServiceMutation, useDeleteRepairServiceMutation } = repairCatalogApi;
