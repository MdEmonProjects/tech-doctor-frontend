import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useMemo } from 'react';
import type { Product } from '../../types';

export interface SpecificationGroup { title: string; rows: { label: string; value: string }[] }
export interface EditorCategory { id: number; name: string; slug: string; isActive: boolean; specificationTemplate: SpecificationGroup[] | null }
export interface CatalogProduct {
  id: number; categoryId: number; category: Pick<EditorCategory, 'id' | 'name' | 'slug' | 'isActive'>;
  name: string; slug: string; sku: string | null; brand: string | null; model: string | null;
  summary: string | null; description: string; price: string | number; regularPrice: string | number | null;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER' | 'DISCONTINUED'; quantity: number;
  status: 'DRAFT' | 'PUBLISHED'; isFeatured: boolean; warranty: string | null;
  features: string[]; specifications: SpecificationGroup[]; colors: string[]; images: string[];
  createdAt: string; updatedAt: string;
}
export type ProductInput = Omit<CatalogProduct, 'id' | 'category' | 'createdAt' | 'updatedAt' | 'price' | 'regularPrice' | 'sku' | 'brand'> & { sku: string; brand: string; price: number; regularPrice: number | null; primaryImage?: string };
export type ProductSave = { product: ProductInput; files: File[] };

const API_URL = (import.meta.env?.VITE_API_URL ?? 'http://localhost:3002').replace(/\/$/, '');
export const productImageUrl = (url: string) => url.startsWith('/api/') ? `${API_URL}${url}` : url;
export const stockLabels: Record<CatalogProduct['stockStatus'], string> = { IN_STOCK: 'In stock', OUT_OF_STOCK: 'Out of stock', PRE_ORDER: 'Pre-order', DISCONTINUED: 'Discontinued' };
export const money = (value: string | number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
export const emptyProductImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23f1f5f9"/%3E%3Ctext x="150" y="155" text-anchor="middle" fill="%2364748b" font-family="sans-serif" font-size="18"%3ENo image%3C/text%3E%3C/svg%3E';

function requestBody({ product, files }: ProductSave) {
  if (!files.length) return product;
  const form = new FormData();
  form.set('payload', JSON.stringify(product));
  files.forEach((file) => form.append('images', file));
  return form;
}

export const productsApi = createApi({
  reducerPath: 'productsApi', tagTypes: ['Products', 'ProductTemplates'], refetchOnFocus: true, refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/api/products`, prepareHeaders: (headers) => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  } }),
  endpoints: (builder) => ({
    getPublicProducts: builder.query<CatalogProduct[], void>({ query: () => '', providesTags: ['Products'] }),
    getPublicProduct: builder.query<CatalogProduct, string>({ query: (id) => `/${id}`, providesTags: ['Products'] }),
    getAdminProducts: builder.query<CatalogProduct[], void>({ query: () => '/admin', providesTags: ['Products'] }),
    getAdminProduct: builder.query<CatalogProduct, number>({ query: (id) => `/admin/${id}`, providesTags: ['Products'] }),
    getProductEditorCategories: builder.query<EditorCategory[], void>({ query: () => '/editor-categories', providesTags: ['ProductTemplates'], keepUnusedDataFor: 0 }),
    createProduct: builder.mutation<CatalogProduct, ProductSave>({ query: (input) => ({ url: '', method: 'POST', body: requestBody(input) }), invalidatesTags: ['Products'] }),
    updateProduct: builder.mutation<CatalogProduct, ProductSave & { id: number }>({ query: ({ id, ...input }) => ({ url: `/${id}`, method: 'PATCH', body: requestBody(input) }), invalidatesTags: ['Products'] }),
    deleteProduct: builder.mutation<{ success: boolean }, number>({ query: (id) => ({ url: `/${id}`, method: 'DELETE' }), invalidatesTags: ['Products'] }),
    saveSpecificationTemplate: builder.mutation<EditorCategory, { id: number; specifications: SpecificationGroup[] }>({ query: ({ id, ...body }) => ({ url: `/templates/${id}`, method: 'PATCH', body }), invalidatesTags: ['ProductTemplates'] }),
  }),
});

export const { useGetPublicProductsQuery, useGetPublicProductQuery, useGetAdminProductsQuery, useGetAdminProductQuery, useGetProductEditorCategoriesQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useSaveSpecificationTemplateMutation } = productsApi;

export function toStoreProduct(product: CatalogProduct): Product {
  return {
    id: String(product.id), slug: product.slug, name: product.name, brand: product.brand ?? '', category: product.category.slug,
    price: Number(product.price), originalPrice: product.regularPrice != null && Number(product.regularPrice) > Number(product.price) ? Number(product.regularPrice) : undefined,
    rating: 0, reviewCount: 0, specs: product.summary || product.features.join(' • '),
    inStock: product.stockStatus === 'IN_STOCK' && product.quantity > 0,
    image: product.images[0] ? productImageUrl(product.images[0]) : emptyProductImage,
    description: product.description, colors: product.colors, features: product.features,
    images: product.images.map(productImageUrl), specifications: product.specifications,
    warranty: product.warranty ?? undefined, model: product.model ?? undefined, sku: product.sku ?? undefined,
    stockStatus: stockLabels[product.stockStatus], isFeatured: product.isFeatured, quantity: product.quantity,
  };
}
export function useStoreProducts() {
  const result = useGetPublicProductsQuery();
  const products = useMemo(() => (result.data ?? []).map(toStoreProduct), [result.data]);
  return { ...result, products };
}
