import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { RootState } from '../../app/store';
import { hasPermission } from '../../features/auth/permissions';
import { AccessPage, ConfirmAction, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';
import { emptyProductImage, money, productImageUrl, stockLabels, useDeleteProductMutation, useGetAdminProductsQuery, type CatalogProduct } from '../../features/products/productsApi';
import { useApp } from '../../context/AppProvider';

export const productAdminPath = '/dashboard/products-devices/products';

export default function Products() {
  const actor = useSelector((state: RootState) => state.auth.user);
  const { data: products = [], isLoading, isError, refetch } = useGetAdminProductsQuery();
  const [remove] = useDeleteProductMutation();
  const { notify } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [deleting, setDeleting] = useState<CatalogProduct | null>(null);
  const categories = [...new Map(products.map((product) => [product.categoryId, product.category])).values()];
  const filtered = products.filter((product) => `${product.name} ${product.sku ?? ''} ${product.brand ?? ''} ${product.model ?? ''}`.toLowerCase().includes(search.trim().toLowerCase()) && (category === 'all' || String(product.categoryId) === category) && (status === 'all' || product.status === status));
  return <AccessPage title="Products" description="Manage your catalog, prices, stock, images, and product specifications." action={hasPermission(actor, 'products.create') && <Link className={accessButton} to={`${productAdminPath}/new`}><Plus size={17} />Add product</Link>}>
    <div className="grid grid-cols-3 gap-3">{[['Total products', products.length], ['Published', products.filter((p) => p.status === 'PUBLISHED').length], ['Drafts', products.filter((p) => p.status === 'DRAFT').length]].map(([label, count]) => <div key={label} className="rounded-xl border border-border bg-slate-50 px-4 py-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold text-slate-900">{count}</p></div>)}</div>
    <div className="flex flex-wrap gap-3"><label className="relative min-w-52 flex-1"><Search size={17} className="absolute left-3 top-3.5 text-slate-400" /><input aria-label="Search products" placeholder="Search name, SKU, brand, or model" className={`${accessInput} !mt-0 pl-10`} value={search} onChange={(e) => setSearch(e.target.value)} /></label><select aria-label="Filter product category" value={category} onChange={(e) => setCategory(e.target.value)} className={`${accessInput} !mt-0 !w-auto`}><option value="all">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select aria-label="Filter publication status" value={status} onChange={(e) => setStatus(e.target.value)} className={`${accessInput} !mt-0 !w-auto`}><option value="all">All statuses</option><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></div>
    <QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} empty={!filtered.length ? 'No products found. Add your first product to start building the catalog.' : undefined} />
    {!isLoading && !isError && filtered.length > 0 && <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((title) => <th key={title} className="px-4 py-3">{title}</th>)}</tr></thead><tbody>{filtered.map((product) => <tr key={product.id} className="border-t border-border"><td className="px-4 py-3"><div className="flex min-w-56 items-center gap-3"><img src={product.images[0] ? productImageUrl(product.images[0]) : emptyProductImage} alt="" className="size-12 rounded-lg border border-border object-contain" /><div><Link to={`${productAdminPath}/${product.id}`} className="font-semibold text-slate-900 hover:text-clay">{product.name}</Link>{(product.sku || product.brand) && <p className="text-xs text-slate-500">{[product.sku, product.brand].filter(Boolean).join(' · ')}</p>}</div></div></td><td className="px-4 py-3 text-slate-600">{product.category.name}</td><td className="whitespace-nowrap px-4 py-3 font-medium">{money(product.price)}</td><td className="whitespace-nowrap px-4 py-3"><p>{stockLabels[product.stockStatus]}</p><p className="text-xs text-slate-500">{product.quantity} units</p></td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{product.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span></td><td className="px-4 py-3"><div className="flex gap-2"><Link to={`${productAdminPath}/${product.id}`} aria-label={`View ${product.name}`} className={accessSecondary}><Eye size={16} /></Link>{hasPermission(actor, 'products.update') && <Link to={`${productAdminPath}/${product.id}/edit`} aria-label={`Edit ${product.name}`} className={accessSecondary}><Pencil size={16} /></Link>}{hasPermission(actor, 'products.delete') && <button type="button" aria-label={`Delete ${product.name}`} onClick={() => setDeleting(product)} className={`${accessSecondary} text-red-600`}><Trash2 size={16} /></button>}</div></td></tr>)}</tbody></table></div>}
    {deleting && <ConfirmAction title="Delete product" confirmLabel="Delete product" onClose={() => setDeleting(null)} onConfirm={async () => { await remove(deleting.id).unwrap(); notify('Product deleted', deleting.name); }}>Delete <strong>{deleting.name}</strong> and its uploaded images? This permanently removes the product from the catalog.</ConfirmAction>}
  </AccessPage>;
}
