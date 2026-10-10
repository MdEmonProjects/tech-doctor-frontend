export interface SidebarMenuItem {
  id: string;
  name: string;
  route: string;
  icon: string;
  subMenu: SidebarMenuItem[] | false;
}

export const menuData: SidebarMenuItem[] = [
  { id: '1', name: 'Dashboard', route: 'dashboard', icon: 'Dashboard', subMenu: false },
  {
    id: '2', name: 'Repair & Service', route: 'repair-service', icon: 'UserPlus',
    subMenu: [
      { id: '22', name: 'Repair Tracking', route: 'repair-tracking', icon: '', subMenu: false },
      { id: '21', name: 'Brands & Services', route: 'brands-services', icon: '', subMenu: false },
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
