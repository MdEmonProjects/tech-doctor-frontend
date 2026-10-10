import { LayoutDashboard, Settings, UserPlus } from 'lucide-react';

const icons = {
  Dashboard: LayoutDashboard,
  UserPlus,
  Settings,
  IoMdSettings: Settings,
};

export default function SvgIcon({ name }: { name: string }) {
  const Icon = icons[name as keyof typeof icons] ?? LayoutDashboard;
  return <Icon aria-hidden="true" size={18} strokeWidth={1.8} />;
}
