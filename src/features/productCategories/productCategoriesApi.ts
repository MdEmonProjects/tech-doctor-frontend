import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategoryInput = Pick<ProductCategory, 'name' | 'slug' | 'isActive'> & { description?: string; image?: File; removeImage?: boolean };

const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3002';

export function productCategoryImageUrl(value: string | null | undefined) {
  return value?.startsWith('/api/') ? `${API_URL.replace(/\/$/, '')}${value}` : value ?? '';
}

function categoryFormData(input: ProductCategoryInput) {
  const form = new FormData();
  form.set('name', input.name);
  form.set('slug', input.slug);
  form.set('isActive', String(input.isActive));
  if (input.description) form.set('description', input.description);
  if (input.image) form.set('image', input.image);
  if (input.removeImage) form.set('removeImage', 'true');
  return form;
}

function categoryBody(input: ProductCategoryInput) {
  if (input.image) return categoryFormData(input);
  return {
    name: input.name,
    slug: input.slug,
    description: input.description,
    isActive: input.isActive,
    removeImage: input.removeImage,
  };
}

export const productCategoriesApi = createApi({
  reducerPath: 'productCategoriesApi',
  tagTypes: ['ProductCategories'],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/product-categories`,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPublicProductCategories: builder.query<ProductCategory[], void>({ query: () => '', providesTags: ['ProductCategories'] }),
    getAdminProductCategories: builder.query<ProductCategory[], void>({ query: () => '/admin', providesTags: ['ProductCategories'] }),
    createProductCategory: builder.mutation<ProductCategory, ProductCategoryInput>({ query: (body) => ({ url: '', method: 'POST', body: categoryBody(body) }), invalidatesTags: ['ProductCategories'] }),
    updateProductCategory: builder.mutation<ProductCategory, ProductCategoryInput & { id: number }>({ query: ({ id, ...body }) => ({ url: `/${id}`, method: 'PATCH', body: categoryBody(body) }), invalidatesTags: ['ProductCategories'] }),
    deleteProductCategory: builder.mutation<{ success: boolean }, number>({ query: (id) => ({ url: `/${id}`, method: 'DELETE' }), invalidatesTags: ['ProductCategories'] }),
  }),
});

export const { useGetPublicProductCategoriesQuery, useGetAdminProductCategoriesQuery, useCreateProductCategoryMutation, useUpdateProductCategoryMutation, useDeleteProductCategoryMutation } = productCategoriesApi;
