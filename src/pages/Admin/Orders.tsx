import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Eye, Plus, Search, SearchX, Trash2 } from 'lucide-react';
import type { RootState } from '../../app/store';
import { hasPermission } from '../../features/auth/permissions';
import { AccessPage, ConfirmAction, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';
import { useApp } from '../../context/AppProvider';
import { money } from '../../features/products/productsApi';
import { ORDER_STATUSES, orderStatusLabels, useDeleteOrderMutation, useGetOrdersQuery, type OrderStatus, type ProductOrder } from '../../features/orders/ordersApi';
import { orderStatusTheme } from '../../features/orders/orderStatusTheme';

export const ordersPath = '/dashboard/products-devices/orders';
type OrderFilter = 'ALL' | OrderStatus;
const filters: OrderFilter[] = ['ALL', ...ORDER_STATUSES];

export default function Orders() {
  const actor = useSelector((state: RootState) => state.auth.user);
  const { data = [], isLoading, isError, refetch } = useGetOrdersQuery();
  const [remove] = useDeleteOrderMutation();
  const { notify } = useApp();
  const [deleting, setDeleting] = useState<ProductOrder | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderFilter>('PENDING');
  const counts = useMemo(() => {
    const result = {} as Record<OrderStatus, number>;
    ORDER_STATUSES.forEach((entry) => { result[entry] = 0; });
    data.forEach((order) => { result[order.status] += 1; });
    return result;
  }, [data]);
  const query = search.trim().toLowerCase();
  const orders = data.filter((order) => (status === 'ALL' || order.status === status) && `${order.orderNumber} ${order.customerName} ${order.email} ${order.phone ?? ''}`.toLowerCase().includes(query));

  return <AccessPage title="Orders" description="Manage product orders and follow each status change." action={hasPermission(actor, 'orders.create') && <Link to={`${ordersPath}/new`} className={accessButton}><Plus size={16} />Create order</Link>}>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div role="tablist" aria-label="Order status queues" className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-slate-50 p-2 [scrollbar-width:thin]">
        {filters.map((entry) => {
          const selected = status === entry;
          const label = entry === 'ALL' ? 'All orders' : orderStatusLabels[entry];
          const count = entry === 'ALL' ? data.length : counts[entry];
          const activeClass = entry === 'ALL' ? 'border-slate-900 bg-slate-900 text-white' : orderStatusTheme[entry].selected;
          return <button key={entry} type="button" role="tab" aria-selected={selected} onClick={() => setStatus(entry)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${selected ? activeClass : 'border-transparent text-slate-700 hover:border-slate-300 hover:bg-white'}`}>
            {entry !== 'ALL' && <span className={`size-2 rounded-full ${orderStatusTheme[entry].dot}`} />}{label}<span className={`rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${selected ? 'bg-white/60' : 'bg-slate-200'}`}>{count}</span>
          </button>;
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3">
        <label className="relative min-w-56 flex-1 sm:max-w-lg"><Search size={17} className="absolute left-3 top-3 text-slate-500" /><input aria-label="Search orders" className={`${accessInput} !mt-0 pl-10`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, customer, email, or phone" /></label>
        <p className="text-sm text-slate-700"><span className="font-bold text-slate-900">{orders.length}</span> {orders.length === 1 ? 'order' : 'orders'} in this list</p>
      </div>
    </div>
    <QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} />
    {!isLoading && !isError && !orders.length && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><SearchX className="mx-auto text-slate-500" /><p className="mt-3 font-semibold text-slate-900">No matching orders</p><p className="mt-1 text-sm text-slate-600">Try another status or search term.</p></div>}
    {!isLoading && !isError && !!orders.length && <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="min-w-[900px] w-full text-left text-sm text-slate-800"><thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-700"><tr>{['Order', 'Customer', 'Phone', 'Items', 'Total', 'Status', 'Created', 'Actions'].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-200">{orders.map((order) => <tr key={order.id} className="hover:bg-slate-50">
      <td className="px-4 py-3 font-semibold"><Link to={`${ordersPath}/${order.id}`} className="text-clay hover:underline">{order.orderNumber}</Link></td>
      <td className="px-4 py-3"><div className="font-semibold text-slate-900">{order.customerName}</div><div className="text-xs text-slate-600">{order.email}</div></td>
      <td className="px-4 py-3">{order.phone ?? '—'}</td>
      <td className="px-4 py-3">{order.items.reduce((count, item) => count + item.quantity, 0)}</td>
      <td className="px-4 py-3 font-semibold">{money(order.total)}</td>
      <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${orderStatusTheme[order.status].badge}`}><span className={`size-1.5 rounded-full ${orderStatusTheme[order.status].dot}`} />{orderStatusLabels[order.status]}</span></td>
      <td className="px-4 py-3">{new Date(order.createdAt).toLocaleString()}</td>
      <td className="px-4 py-3"><div className="flex gap-2"><Link to={`${ordersPath}/${order.id}`} className={accessSecondary}><Eye size={15} className="mr-1 inline" />View</Link>{hasPermission(actor, 'orders.delete') && <button type="button" className={`${accessSecondary} text-red-700`} onClick={() => setDeleting(order)}><Trash2 size={15} className="mr-1 inline" />Delete</button>}</div></td>
    </tr>)}</tbody></table></div>}
    {deleting && <ConfirmAction title="Delete order" confirmLabel="Delete order" onClose={() => setDeleting(null)} onConfirm={async () => { await remove(deleting.id).unwrap(); notify('Order deleted', deleting.orderNumber); }}>Delete {deleting.orderNumber} and its full history permanently?</ConfirmAction>}
  </AccessPage>;
}
