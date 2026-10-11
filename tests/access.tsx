import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import store from '../src/app/store';
import { loginSuccess } from '../src/features/auth/authSlice';
import { authQuerySlice } from '../src/features/auth/authQuerySlice';
import { accessApi, type AccessRole, type Permission } from '../src/features/access/accessApi';
import { repairCatalogApi } from '../src/features/repairCatalog/repairCatalogApi';
import RepairBrandModels from '../src/pages/Admin/RepairBrandModels';
import Users from '../src/pages/Admin/Users';
import Roles from '../src/pages/Admin/Roles';
import Permissions from '../src/pages/Admin/Permissions';
import PermissionRoute from '../src/routes/PermissionRoute';
import Sidebar from '../src/components/Sidebar/Sidebar';

const actor = (role: string, permissions: string[]) => store.dispatch(loginSuccess({ accessToken: 'test-only', user: { id: 1, name: 'Tester', email: 'tester@example.invalid', role, roleId: 1, roleName: role, permissions } }));
const render = (element: React.ReactNode, path = '/') => renderToStaticMarkup(<Provider store={store}><MemoryRouter initialEntries={[path]}>{element}</MemoryRouter></Provider>);
const service = { id: 1, name: 'Screen replacement', description: null, estimatedTime: null, warranty: null };
const viewPermission: Permission = { id: 1, key: 'catalog.view', name: 'View catalog', description: null, group: 'Repair catalog', isSystem: true };
const staffRole: AccessRole = { id: 2, key: 'STAFF', name: 'Staff', description: null, isSystem: true, _count: { users: 1 }, permissions: [{ permissionId: 1, permission: viewPermission }] };

try {
  await store.dispatch(repairCatalogApi.util.upsertQueryData('getRepairCatalog', undefined, [{ id: 99, name: 'Example brand', models: [{ id: 10, name: 'Phone X', deviceType: 'Phone', services: [{ id: 11, service, price: 45 }] }] }]));
  await store.dispatch(repairCatalogApi.util.upsertQueryData('getRepairServices', undefined, [service]));
  await store.dispatch(accessApi.util.upsertQueryData('getUsers', undefined, [{ id: 2, name: 'Staff user', email: 'staff@example.invalid', roleId: 2, isActive: true, createdAt: new Date().toISOString(), assignedRole: { key: 'STAFF', name: 'Staff' } }]));
  await store.dispatch(accessApi.util.upsertQueryData('getUserRoles', undefined, [staffRole]));
  await store.dispatch(accessApi.util.upsertQueryData('getRoles', undefined, [staffRole]));
  await store.dispatch(accessApi.util.upsertQueryData('getRolePermissions', undefined, [viewPermission]));
  await store.dispatch(accessApi.util.upsertQueryData('getPermissions', undefined, [viewPermission]));
  const models = <Routes><Route path="/brand/:brandId" element={<RepairBrandModels />} /></Routes>;

  actor('TECHNICIAN', ['catalog.view', 'catalog.models.create', 'catalog.services.create']);
  let html = render(models, '/brand/99');
  assert.ok(html.includes('New service') && html.includes('Save model &amp; services'), 'Assigned create permissions must show the existing model sidebar workflow.');
  assert.ok(!html.includes('Remove model Phone X') && !html.includes('Remove service Screen replacement'), 'Create access must not expose deletion controls.');
  actor('SERVICE_EDITOR', ['catalog.view', 'catalog.services.update']);
  html = render(models, '/brand/99');
  assert.ok(html.includes('Edit service Screen replacement'), 'Service editors must have their permitted action.');
  assert.ok(!html.includes('Save model &amp; services') && !html.includes('New service'), 'Service editing must not grant model creation or service creation.');
  actor('STAFF', ['catalog.view']);
  html = render(models, '/brand/99');
  assert.ok(html.includes('Phone X') && !html.includes('model-form'), 'View-only staff must see models without a management form.');
  html = render(<Sidebar />);
  assert.ok(!html.includes('All users') && !html.includes('Manage users'), 'Access-management navigation must be hidden without permission.');
  actor('USER_EDITOR', ['users.view', 'users.update', 'catalog.view']);
  html = render(<Users />);
  assert.ok(html.includes('Staff user') && html.includes('Edit'), 'User editors must see the user list and edit controls.');
  assert.ok(!html.includes('Add user') && !html.includes('Deactivate'), 'User editing must not grant creation or deactivation.');
  const guarded = <Routes><Route element={<PermissionRoute permission="roles.view" />}><Route path="/" element={<div>Role management allowed</div>} /></Route></Routes>;
  assert.ok(render(guarded).includes('You do not have permission'), 'Direct visits must enforce page permission.');
  actor('ROLE_VIEWER', ['roles.view']);
  html = render(<Roles />);
  assert.ok(html.includes('Staff') && !html.includes('Add role') && !html.includes('Edit permissions'), 'Role viewing must not expose role changes.');
  actor('PERMISSION_AUTHOR', ['permissions.view', 'permissions.create']);
  html = render(<Permissions />);
  assert.ok(html.includes('Add permission') && !html.includes('>Edit<'), 'Permission creation must be independent of editing.');
  actor('ADMIN', ['*']);
  assert.ok(render(guarded).includes('Role management allowed'), 'Protected administrators must retain access.');
  assert.ok(render(<Sidebar />, '/dashboard/users/accounts').includes('All users'), 'Administrators must see the Users menu.');
  console.log('Access UI checks passed: custom roles, separate action permissions, view-only staff, menu visibility, and direct-page access.');
} finally {
  store.dispatch(accessApi.util.resetApiState());
  store.dispatch(repairCatalogApi.util.resetApiState());
  store.dispatch(authQuerySlice.util.resetApiState());
}
