import type { OrderStatus } from './ordersApi';

export const orderStatusTheme: Record<OrderStatus, { dot: string; badge: string; selected: string }> = {
  PENDING: { dot: 'bg-amber-500', badge: 'border-amber-200 bg-amber-50 text-amber-900', selected: 'border-amber-300 bg-amber-50 text-amber-950' },
  CONFIRMED: { dot: 'bg-blue-500', badge: 'border-blue-200 bg-blue-50 text-blue-900', selected: 'border-blue-300 bg-blue-50 text-blue-950' },
  PROCESSING: { dot: 'bg-violet-500', badge: 'border-violet-200 bg-violet-50 text-violet-900', selected: 'border-violet-300 bg-violet-50 text-violet-950' },
  SHIPPED: { dot: 'bg-cyan-500', badge: 'border-cyan-200 bg-cyan-50 text-cyan-900', selected: 'border-cyan-300 bg-cyan-50 text-cyan-950' },
  DELIVERED: { dot: 'bg-emerald-600', badge: 'border-emerald-200 bg-emerald-50 text-emerald-900', selected: 'border-emerald-300 bg-emerald-50 text-emerald-950' },
  CANCELLED: { dot: 'bg-rose-500', badge: 'border-rose-200 bg-rose-50 text-rose-900', selected: 'border-rose-300 bg-rose-50 text-rose-950' },
};
