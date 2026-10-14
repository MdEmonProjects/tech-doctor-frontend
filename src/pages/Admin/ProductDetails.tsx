import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import type { RootState } from '../../app/store';
import { hasPermission } from '../../features/auth/permissions';
import { AccessPage, QueryFeedback, accessButton, accessSecondary } from '../../components/AccessUi';
import ProductSpecifications from '../../components/ProductSpecifications';
import { emptyProductImage, money, productImageUrl, stockLabels, useGetAdminProductQuery } from '../../features/products/productsApi';
import { productAdminPath } from './Products';

export default function ProductDetails() {
  const { productId } = useParams();
  const actor = useSelector((state: RootState) => state.auth.user);
  const { data: product, isLoading, isError, refetch } = useGetAdminProductQuery(Number(productId));
  if (!product) return <AccessPage title="Product details" description=""><QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} /><Link to={productAdminPath} className={accessSecondary}>Back to products</Link></AccessPage>;
  return <AccessPage title={product.name} description={[product.category.name, product.sku].filter(Boolean).join(' · ')} action={<div className="flex gap-2"><Link to={productAdminPath} className={accessSecondary}>All products</Link>{hasPermission(actor, 'products.update') && <Link to={`${productAdminPath}/${product.id}/edit`} className={accessButton}>Edit product</Link>}</div>}>
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]"><div><img src={product.images[0] ? productImageUrl(product.images[0]) : emptyProductImage} alt={product.name} className="aspect-square max-h-96 w-full rounded-xl border border-border bg-slate-50 object-contain p-5" /><div className="mt-3 flex flex-wrap gap-2">{product.images.slice(1).map((url) => <a key={url} href={productImageUrl(url)} target="_blank" rel="noreferrer"><img src={productImageUrl(url)} alt={product.name} className="size-20 rounded-lg border border-border object-contain" /></a>)}</div></div><div className="space-y-5"><div className="flex gap-2 text-xs font-semibold"><span className="rounded-full bg-slate-100 px-3 py-1">{product.status}</span>{product.isFeatured && <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Featured</span>}</div><p className="text-3xl font-semibold">{money(product.price)} {product.regularPrice && <span className="text-lg font-normal text-slate-400 line-through">{money(product.regularPrice)}</span>}</p><p className="text-sm text-slate-500">{product.summary}</p><dl className="grid grid-cols-2 gap-3 text-sm">{[['Brand', product.brand], ['Model', product.model], ['Availability', stockLabels[product.stockStatus]], ['Quantity', product.quantity], ['Warranty', product.warranty], ['Colors', product.colors.join(', ')], ['URL slug', product.slug]].map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="mt-1 font-medium">{value || '—'}</dd></div>)}</dl>{product.features.length > 0 && <div><h2 className="font-semibold">Key features</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">{product.features.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}</div></div>
    <section className="border-t border-border pt-5"><h2 className="mb-3 text-lg font-semibold">Specifications</h2>{product.specifications.length ? <ProductSpecifications groups={product.specifications} /> : <p className="text-sm text-slate-500">No specifications added.</p>}</section>
    <section className="border-t border-border pt-5"><h2 className="mb-3 text-lg font-semibold">Description</h2><p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">{product.description || 'No description added.'}</p></section>
  </AccessPage>;
}
