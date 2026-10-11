export interface SidebarMenuItem {
  id: string;
  name: string;
  route: string;
  icon: string;
  subMenu: SidebarMenuItem[] | false;
  permission?: string;
}

export const menuData: SidebarMenuItem[] = [
  { id: '1', name: 'Dashboard', route: '', icon: 'Dashboard', subMenu: false },
  {
    id: '2', name: 'Repair & Service', route: 'repair-service', icon: 'UserPlus',
    subMenu: [
      { id: '22', name: 'Repair Tracking', route: 'repair-tracking', icon: '', subMenu: false, permission: 'catalog.view' },
      { id: '21', name: 'Brands & Services', route: 'brands-services', icon: '', subMenu: false, permission: 'catalog.view' },
    ],
  },
  {
    id: 'users', name: 'Users', route: 'users', icon: 'UserPlus',
    subMenu: [
      { id: 'users-accounts', name: 'All users', route: 'accounts', icon: '', subMenu: false, permission: 'users.view' },
      { id: 'users-roles', name: 'Roles', route: 'roles', icon: '', subMenu: false, permission: 'roles.view' },
      { id: 'users-permissions', name: 'Permissions', route: 'permissions', icon: '', subMenu: false, permission: 'permissions.view' },
    ],
  },
  // {
  //   id: '4', name: 'Time settings', route: 'timesetting', icon: 'Dashboard',
  //   subMenu: [
  //     { id: '40', name: 'Time settings', route: '', icon: '', subMenu: false },
  //     { id: '41', name: 'Shift list', route: 'shiftlist', icon: '', subMenu: false },
  //     { id: '42', name: 'Check-in & check-out', route: 'timechecklist', icon: '', subMenu: false },
  //   ],
  // },
  // { id: '3', name: 'Settings', route: 'settings', icon: 'Settings', subMenu: false },
];
