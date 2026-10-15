import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, Trash2 } from 'lucide-react';
import { AccessPage, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';
import { catalogError } from '../../components/RepairServiceDialog';
import { useApp } from '../../context/AppProvider';
import { emptyProductImage, money, productImageUrl, useGetPublicProductsQuery } from '../../features/products/productsApi';
import { useCreateOrderMutation, useGetOrderQuery, useUpdateOrderMutation, type OrderInput, type ProductOrder } from '../../features/orders/ordersApi';
import { ordersPath } from './Orders';

const blank: OrderInput = { customerName: '', email: '', phone: '', address: '', city: '', postalCode: '', items: [] };
const customerFields = [
  { key: 'customerName', label: 'Customer name', max: 120 },
  { key: 'email', label: 'Email', max: 320 },
  { key: 'phone', label: 'Phone', max: 25 },
  { key: 'address', label: 'Street address', max: 500 },
  { key: 'city', label: 'City', max: 120 },
  { key: 'postalCode', label: 'Postal / ZIP code', max: 30 },
] as const;

function Form({ current }: { current?: ProductOrder }) {
  const [form, setForm] = useState<OrderInput>(() => current ? {
    customerName: current.customerName, email: current.email, phone: current.phone ?? '', address: current.address,
    city: current.city, postalCode: current.postalCode,
    items: current.items.map(({ productId, quantity }) => ({ productId, quantity })),
  } : blank);
  const [error, setError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(!current);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(24);
  const savingRef = useRef(false);
  const { notify } = useApp();
  const navigate = useNavigate();
  const { data: products = [], isLoading: productsLoading, isError: productsError, refetch } = useGetPublicProductsQuery();
  const [create, { isLoading: creating }] = useCreateOrderMutation();
  const [update, { isLoading: updating }] = useUpdateOrderMutation();
  const busy = creating || updating;
  const itemsLocked = current?.status === 'SHIPPED' || current?.history.some((entry) => entry.status === 'SHIPPED' || entry.status === 'DELIVERED');
  const available = products.filter((product) => product.status === 'PUBLISHED' && product.stockStatus === 'IN_STOCK' && product.quantity > 0);
  const query = search.trim().toLowerCase();
  const matches = available.filter((product) => `${product.name} ${product.sku ?? ''} ${product.brand ?? ''} ${product.model ?? ''} ${product.category.name}`.toLowerCase().includes(query));
  const selected = new Set(form.items.map((item) => item.productId));
  const change = (key: keyof Omit<OrderInput, 'items'>, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  const addProduct = (productId: number) => {
    setForm((previous) => previous.items.some((item) => item.productId === productId) ? previous : { ...previous, items: [...previous.items, { productId, quantity: 1 }] });
    setError('');
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (savingRef.current || busy) return;
    setError('');
    if (!form.phone.trim()) { setError('Enter the customer phone number.'); return; }
    if (!form.items.length || form.items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      setError('Add at least one product with a valid quantity.'); return;
    }
    savingRef.current = true;
    try {
      const itemsChanged = !current || JSON.stringify(form.items) !== JSON.stringify(current.items.map(({ productId, quantity }) => ({ productId, quantity })));
      const body = {
        customerName: form.customerName.trim(), email: form.email.trim(), phone: form.phone.trim(),
        address: form.address.trim(), city: form.city.trim(), postalCode: form.postalCode.trim(),
        ...(itemsChanged ? { items: form.items } : {}),
      };
      const saved = current ? await update({ id: current.id, body }).unwrap() : await create({ ...body, items: form.items }).unwrap();
      notify(current ? 'Order updated' : 'Order created', saved.orderNumber);
      navigate(`${ordersPath}/${saved.id}`);
    } catch (failure) {
      setError(catalogError(failure));
    } finally {
      savingRef.current = false;
    }
  };

  return <form onSubmit={submit} className="space-y-5">
    <section className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900">
      <h2 className="font-semibold">Customer and delivery</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {customerFields.map(({ key, label, max }) => <label key={key} className="text-sm font-semibold text-slate-800">
          {label} *
          <input required type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} maxLength={max}
            autoComplete={key === 'email' ? 'email' : key === 'phone' ? 'tel' : key === 'address' ? 'street-address' : key === 'city' ? 'address-level2' : key === 'postalCode' ? 'postal-code' : 'name'}
            className={accessInput} value={form[key]} onChange={(event) => change(key, event.target.value)} />
        </label>)}
      </div>
    </section>

    <section className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="font-semibold">Products</h2><p className="mt-1 text-xs text-slate-600">Search by name, code, brand, model, or category. Current catalog prices apply when products change.</p></div>
        {!itemsLocked && <button type="button" className={accessSecondary} onClick={() => setPickerOpen((open) => !open)}><Plus size={16} className="mr-1 inline" />{pickerOpen ? 'Hide products' : 'Find products'}</button>}
      </div>

      {form.items.length ? <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
        {form.items.map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          const snapshot = current?.items.find((entry) => entry.productId === item.productId);
          return <div key={item.productId} className="flex flex-wrap items-center gap-3 p-3">
            <img src={product?.images[0] ? productImageUrl(product.images[0]) : snapshot?.image ? productImageUrl(snapshot.image) : emptyProductImage} alt="" className="size-16 rounded-lg border border-slate-200 bg-white object-contain" />
            <div className="min-w-44 flex-1"><p className="font-semibold text-slate-900">{product?.name ?? snapshot?.name ?? `Product #${item.productId}`}</p><p className="text-xs text-slate-600">{product?.sku ?? snapshot?.sku ?? 'No product code'} · {money(snapshot?.unitPrice ?? product?.price ?? 0)}</p></div>
            <label className="text-xs font-semibold text-slate-700">Quantity<input type="number" min="1" max="1000" required disabled={itemsLocked} className={`${accessInput} w-24`} value={item.quantity} onChange={(event) => setForm((previous) => ({ ...previous, items: previous.items.map((entry) => entry.productId === item.productId ? { ...entry, quantity: Number(event.target.value) } : entry) }))} /></label>
            {!itemsLocked && <button type="button" aria-label={`Remove ${product?.name ?? snapshot?.name ?? 'product'}`} className={`${accessSecondary} text-red-700`} onClick={() => setForm((previous) => ({ ...previous, items: previous.items.filter((entry) => entry.productId !== item.productId) }))}><Trash2 size={16} /></button>}
          </div>;
        })}
      </div> : <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-600">No products added yet.</p>}

      {pickerOpen && !itemsLocked && <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
        <label className="relative block"><Search size={18} className="absolute left-3 top-3 text-slate-500" /><input type="search" aria-label="Search products to add" className={`${accessInput} !mt-0 pl-10`} value={search} onChange={(event) => { setSearch(event.target.value); setVisible(24); }} placeholder="Search 200+ products by name, code, brand, model, or category" /></label>
        <QueryFeedback loading={productsLoading} failed={productsError} retry={() => void refetch()} />
        {!productsLoading && !productsError && !matches.length && <p className="py-6 text-center text-sm text-slate-600">No available products match this search.</p>}
        <div className="grid max-h-[32rem] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">{matches.slice(0, visible).map((product) => <article key={product.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <img src={product.images[0] ? productImageUrl(product.images[0]) : emptyProductImage} alt="" className="size-20 shrink-0 rounded-lg border border-slate-200 object-contain" />
          <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</p><p className="truncate text-xs text-slate-600">{[product.brand, product.sku].filter(Boolean).join(' · ') || product.category.name}</p><p className="mt-1 text-sm font-bold text-slate-900">{money(product.price)}</p><p className="text-xs text-slate-600">{product.quantity} in stock</p><button type="button" disabled={selected.has(product.id)} onClick={() => addProduct(product.id)} className="mt-2 rounded-md bg-clay px-2.5 py-1.5 text-xs font-semibold text-white disabled:bg-slate-200 disabled:text-slate-600">{selected.has(product.id) ? 'Added' : 'Add product'}</button></div>
        </article>)}</div>
        {matches.length > visible && <button type="button" className={accessSecondary} onClick={() => setVisible((count) => count + 24)}>Show more ({matches.length - visible} remaining)</button>}
      </div>}
    </section>

    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
    <div className="flex justify-end gap-3"><Link to={current ? `${ordersPath}/${current.id}` : ordersPath} className={accessSecondary}>Cancel</Link><button type="submit" disabled={busy || (!current && (productsLoading || productsError))} className={accessButton}>{busy ? 'Saving…' : current ? 'Save changes' : 'Create order'}</button></div>
  </form>;
}

export default function OrderEditor() {
  const { orderId } = useParams();
  const editing = Boolean(orderId);
  const { data, isLoading, isError, refetch } = useGetOrderQuery(Number(orderId), { skip: !editing });
  return <AccessPage title={editing ? 'Edit order' : 'Create order'} description="Customer details and product quantities can be changed here.">
    <QueryFeedback loading={editing && isLoading} failed={editing && isError} retry={() => void refetch()} />
    {(!editing || data) && <Form key={data?.id ?? 'new'} current={data} />}
  </AccessPage>;
}
