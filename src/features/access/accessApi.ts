import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authQuerySlice } from '../auth/authQuerySlice';

export interface Permission { id: number; key: string; name: string; description: string | null; group: string; isSystem: boolean; }
export interface AccessRole { id: number; key: string; name: string; description: string | null; isSystem: boolean; permissions: { permissionId: number; permission: Permission }[]; _count: { users: number }; }
export interface ManagedUser { id: number; email: string; name: string | null; roleId: number; isActive: boolean; createdAt: string; assignedRole: { key: string; name: string }; }
export interface UserInput { email: string; name?: string; roleId: number; password?: string; }
export interface RoleInput { name: string; description?: string; permissionIds: number[]; }
export interface PermissionInput { name: string; description?: string; group: string; }
const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3002';

export const accessApi = createApi({
  reducerPath: 'accessApi',
  tagTypes: ['Access'],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => {
    const refreshSession = async (_: unknown, { dispatch, queryFulfilled }: { dispatch: (action: ReturnType<typeof authQuerySlice.util.invalidateTags>) => unknown; queryFulfilled: Promise<unknown> }) => {
      try { await queryFulfilled; dispatch(authQuerySlice.util.invalidateTags(['Session'])); } catch { /* The form displays mutation failures. */ }
    };
    return {
      getUsers: builder.query<ManagedUser[], void>({ query: () => '/users', providesTags: ['Access'] }),
      getUserRoles: builder.query<AccessRole[], void>({ query: () => '/users/roles', providesTags: ['Access'] }),
      createUser: builder.mutation<ManagedUser, UserInput & { password: string }>({ query: (body) => ({ url: '/users', method: 'POST', body }), invalidatesTags: ['Access'] }),
      updateUser: builder.mutation<ManagedUser, UserInput & { id: number }>({ query: ({ id, ...body }) => ({ url: `/users/${id}`, method: 'PATCH', body }), invalidatesTags: ['Access'], onQueryStarted: refreshSession }),
      setUserStatus: builder.mutation<ManagedUser, { id: number; isActive: boolean }>({ query: ({ id, ...body }) => ({ url: `/users/${id}/status`, method: 'PATCH', body }), invalidatesTags: ['Access'], onQueryStarted: refreshSession }),
      getRoles: builder.query<AccessRole[], void>({ query: () => '/access/roles', providesTags: ['Access'] }),
      getRolePermissions: builder.query<Permission[], void>({ query: () => '/access/roles/permissions', providesTags: ['Access'] }),
      createRole: builder.mutation<AccessRole, RoleInput & { key: string }>({ query: (body) => ({ url: '/access/roles', method: 'POST', body }), invalidatesTags: ['Access'] }),
      updateRole: builder.mutation<AccessRole, RoleInput & { id: number }>({ query: ({ id, ...body }) => ({ url: `/access/roles/${id}`, method: 'PATCH', body }), invalidatesTags: ['Access'], onQueryStarted: refreshSession }),
      deleteRole: builder.mutation<{ success: boolean }, number>({ query: (id) => ({ url: `/access/roles/${id}`, method: 'DELETE' }), invalidatesTags: ['Access'] }),
      getPermissions: builder.query<Permission[], void>({ query: () => '/access/permissions', providesTags: ['Access'] }),
      createPermission: builder.mutation<Permission, PermissionInput & { key: string }>({ query: (body) => ({ url: '/access/permissions', method: 'POST', body }), invalidatesTags: ['Access'] }),
      updatePermission: builder.mutation<Permission, PermissionInput & { id: number }>({ query: ({ id, ...body }) => ({ url: `/access/permissions/${id}`, method: 'PATCH', body }), invalidatesTags: ['Access'] }),
      deletePermission: builder.mutation<{ success: boolean }, number>({ query: (id) => ({ url: `/access/permissions/${id}`, method: 'DELETE' }), invalidatesTags: ['Access'] }),
    };
  },
});

export const { useGetUsersQuery, useGetUserRolesQuery, useCreateUserMutation, useUpdateUserMutation, useSetUserStatusMutation, useGetRolesQuery, useGetRolePermissionsQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRoleMutation, useGetPermissionsQuery, useCreatePermissionMutation, useUpdatePermissionMutation, useDeletePermissionMutation } = accessApi;
