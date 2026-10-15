import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Check, Download, RefreshCw } from 'lucide-react';
import type { RootState } from '../../app/store';
import { hasPermission } from '../../features/auth/permissions';
import { AccessPage, ConfirmAction, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';
import { catalogError } from '../../components/RepairServiceDialog';
import { useApp } from '../../context/AppProvider';
import { money, productImageUrl } from '../../features/products/productsApi';
import { ORDER_STATUSES, orderStatusLabels, useDeleteOrderMutation, useGetOrderQuery, useUpdateOrderStatusMutation, type OrderHistory, type OrderStatus } from '../../features/orders/ordersApi';
import { orderStatusTheme } from '../../features/orders/orderStatusTheme';
import { downloadOrderInvoice } from '../../features/orders/invoice';
import { ordersPath } from './Orders';

const fieldLabels: Record<string, string> = { customerName: 'Customer name', email: 'Email', phone: 'Phone', address: 'Address', city: 'City', postalCode: 'Postal code', items: 'Products', total: 'Total' };

function HistoryDetails({ entry }: { entry: OrderHistory }) {
  const fields = entry.changes?.fields ?? [];
  if (!fields.length) return null;
  return <div className="mt-2 space-y-1 rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
    {fields.map((field) => {
      const before = entry.changes?.before?.[field];
      const after = entry.changes?.after?.[field];
      return <p key={field}><span className="font-semibold text-slate-900">{fieldLabels[field] ?? field}:</span> {before !== undefined || after !== undefined ? <>{before || '—'} → {after || '—'}</> : 'Updated'}</p>;
    })}
  </div>;
}

export default function OrderDetails() {
  const { orderId } = useParams();
  const { data: order, isLoading, isError, refetch } = useGetOrderQuery(Number(orderId), { refetchOnMountOrArgChange: true });
  const actor = useSelector((state: RootState) => state.auth.user);
  const { notify } = useApp();
  const [saveStatus, { isLoading: saving }] = useUpdateOrderStatusMutation();
  const [remove] = useDeleteOrderMutation();
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const savingRef = useRef(false);
  const navigate = useNavigate();
  useEffect(() => { if (order) setStatus(order.status); }, [order?.id, order?.status]);

  const submitStatus = async (event: FormEvent) => {
    event.preventDefault();
    if (!order || !status || status === order.status || savingRef.current || saving) return;
    setError('');
    if (status === 'CANCELLED' && !note.trim()) { setError('A cancellation note is required.'); return; }
    savingRef.current = true;
    try {
      const saved = await saveStatus({ id: order.id, status, note: note.trim() }).unwrap();
      notify(status === 'CANCELLED' ? 'Order cancelled' : 'Order status updated', status === 'CANCELLED' ? note.trim() : `${orderStatusLabels[order.status]} → ${orderStatusLabels[saved.status]}`);
      setStatus(saved.status);
      setNote('');
    } catch (failure) {
      setError(catalogError(failure));
    } finally {
      savingRef.current = false;
    }
  };

  if (!order) return <AccessPage title="Order details" description=""><QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} /><Link to={ordersPath} className={accessSecondary}>All orders</Link></AccessPage>;
  const closed = order.status === 'DELIVERED' || order.status === 'CANCELLED';
  return <AccessPage title={order.orderNumber} description={`Placed ${new Date(order.createdAt).toLocaleString()} · ${orderStatusLabels[order.status]}`} action={<div className="flex flex-wrap gap-2">
    <Link to={ordersPath} className={accessSecondary}>All orders</Link>
    <button type="button" className={accessSecondary} onClick={() => { try { downloadOrderInvoice(order); notify('Invoice downloaded', `${order.orderNumber}-invoice.pdf`); } catch { notify('Invoice failed', 'Could not download the invoice.', 'warning'); } }}><Download size={16} className="mr-1 inline" />Download invoice</button>
    {hasPermission(actor, 'orders.update') && !closed && <Link to={`${ordersPath}/${order.id}/edit`} className={accessButton}>Edit order</Link>}
    {hasPermission(actor, 'orders.delete') && <button type="button" className={`${accessSecondary} text-red-700`} onClick={() => setDeleting(true)}>Delete</button>}
  </div>}>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900"><h2 className="font-semibold">Customer and delivery</h2><dl className="mt-3 grid gap-3 text-sm">
        <div><dt className="font-medium text-slate-600">Customer</dt><dd className="font-semibold">{order.customerName}</dd></div>
        <div><dt className="font-medium text-slate-600">Email</dt><dd>{order.email}</dd></div>
        <div><dt className="font-medium text-slate-600">Phone</dt><dd>{order.phone || '—'}</dd></div>
        <div><dt className="font-medium text-slate-600">Address</dt><dd>{order.address}, {order.city} {order.postalCode}</dd></div>
      </dl></section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900"><h2 className="font-semibold">Totals</h2><dl className="mt-3 space-y-2 text-sm">
        {([['Subtotal', order.subtotal], ['Shipping', order.shipping], ['Tax', order.tax], ['Total', order.total]] as const).map(([label, value]) => <div key={label} className="flex justify-between"><dt>{label}</dt><dd className={label === 'Total' ? 'font-bold' : ''}>{money(value)}</dd></div>)}
      </dl><p className="mt-4 text-xs text-slate-600">Payment is arranged separately. This order does not record a payment.</p></section>
    </div>

    <section className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900"><h2 className="font-semibold">Products</h2><div className="mt-3 divide-y divide-slate-200">{order.items.map((item) => <div key={item.productId} className="flex items-center gap-3 py-3"><div className="size-12 shrink-0 rounded bg-slate-50">{item.image && <img src={productImageUrl(item.image)} alt="" className="size-12 object-contain" />}</div><div className="min-w-0 flex-1"><p className="font-medium">{item.name}</p>{item.sku && <p className="text-xs text-slate-600">{item.sku}</p>}</div><div className="text-right text-sm"><p>{item.quantity} × {money(item.unitPrice)}</p><p className="font-semibold">{money(item.quantity * item.unitPrice)}</p></div></div>)}</div></section>

    {hasPermission(actor, 'orders.status') && !closed && <form onSubmit={submitStatus} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 text-slate-900">
      <h2 className="font-semibold">Update status</h2>
      <fieldset><legend className="mb-2 text-sm font-semibold text-slate-800">New status</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{ORDER_STATUSES.map((value) => <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold ${status === value ? orderStatusTheme[value].selected : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}><input type="radio" name="order-status" value={value} checked={status === value} onChange={() => setStatus(value)} className="sr-only" /><span className={`size-2 rounded-full ${orderStatusTheme[value].dot}`} /><span className="flex-1">{orderStatusLabels[value]}</span>{status === value && <Check size={16} />}</label>)}</div></fieldset>
      <label className="block text-sm font-semibold text-slate-800">Note {status === 'CANCELLED' ? '*' : '(optional)'}<textarea required={status === 'CANCELLED'} maxLength={5000} rows={3} className={`${accessInput} h-auto py-2`} value={note} onChange={(event) => setNote(event.target.value)} placeholder={status === 'CANCELLED' ? 'Reason for cancellation' : 'Details about this update'} /></label>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={saving || !status || status === order.status} className={accessButton}><RefreshCw size={16} className={saving ? 'animate-spin' : ''} />{saving ? (status === 'CANCELLED' ? 'Cancelling…' : 'Saving…') : status === 'CANCELLED' ? 'Cancel order' : 'Save status'}</button>
    </form>}

    <section className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900"><h2 className="font-semibold">Order history</h2><ol className="mt-4 space-y-4 border-l-2 border-slate-200 pl-5">{order.history.map((entry) => <li key={entry.id} className="relative text-sm before:absolute before:-left-[27px] before:top-1 before:size-3 before:rounded-full before:bg-clay"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{entry.eventType === 'CREATED' ? 'Order created' : entry.eventType === 'DETAILS_UPDATED' ? 'Order details updated' : `${entry.changes?.fromStatus ? `${orderStatusLabels[entry.changes.fromStatus]} → ` : ''}${orderStatusLabels[entry.status]}`}</p><time className="text-xs text-slate-600">{new Date(entry.createdAt).toLocaleString()}</time></div>{entry.note && <p className="mt-1 whitespace-pre-wrap text-slate-700">{entry.note}</p>}<HistoryDetails entry={entry} /><p className="mt-1 text-xs text-slate-600">{entry.updatedBy ? `By ${entry.updatedBy.name || entry.updatedBy.email}` : 'Customer checkout'}</p></li>)}</ol></section>
    {deleting && <ConfirmAction title="Delete order" confirmLabel="Delete order" onClose={() => setDeleting(false)} onConfirm={async () => { await remove(order.id).unwrap(); notify('Order deleted', order.orderNumber); navigate(ordersPath); }}>Delete {order.orderNumber} and its full history permanently?</ConfirmAction>}
  </AccessPage>;
}
