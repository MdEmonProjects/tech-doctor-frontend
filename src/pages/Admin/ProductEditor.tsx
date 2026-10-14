import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ImagePlus, Save, X } from 'lucide-react';
import type { RootState } from '../../app/store';
import { hasPermission } from '../../features/auth/permissions';
import { useApp } from '../../context/AppProvider';
import { AccessPage, ConfirmAction, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';
import { catalogError } from '../../components/RepairServiceDialog';
import ProductSpecificationEditor, { starterSpecifications } from '../../components/ProductSpecificationEditor';
import { productImageUrl, stockLabels, useCreateProductMutation, useGetAdminProductQuery, useGetProductEditorCategoriesQuery, useSaveSpecificationTemplateMutation, useUpdateProductMutation, type CatalogProduct, type EditorCategory, type ProductInput } from '../../features/products/productsApi';
import { productAdminPath } from './Products';

const slugify = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const blank: ProductInput = { name: '', slug: '', sku: '', categoryId: 0, brand: '', model: '', summary: '', description: '', price: 0, regularPrice: null, stockStatus: 'OUT_OF_STOCK', quantity: 0, status: 'DRAFT', isFeatured: false, warranty: '', features: [], specifications: [], colors: [], images: [] };

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) { return <label className="block text-sm font-medium text-slate-700">{label}{children}{hint && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}</label>; }
function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) { return <section className="space-y-4 rounded-xl border border-border bg-white p-5"><div><h2 className="font-semibold text-slate-900">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>{children}</section>; }
function FilePreview({ file }: { file: File }) {
  const [url, setUrl] = useState('');
  useEffect(() => { const next = URL.createObjectURL(file); setUrl(next); return () => URL.revokeObjectURL(next); }, [file]);
  return url ? <img src={url} alt={file.name} className="aspect-square w-full object-contain p-2" /> : null;
}

function ProductForm({ current, categories }: { current?: CatalogProduct; categories: EditorCategory[] }) {
  const initial = (): ProductInput => {
    if (!current) return { ...blank };
    const { id: _id, category: _category, createdAt: _createdAt, updatedAt: _updatedAt, ...values } = current;
    return { ...values, sku: current.sku ?? '', brand: current.brand ?? '', price: Number(current.price), regularPrice: current.regularPrice == null ? null : Number(current.regularPrice), primaryImage: current.images[0] };
  };
  const [form, setForm] = useState<ProductInput>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [featuresText, setFeaturesText] = useState(current?.features.join('\n') ?? '');
  const [colorsText, setColorsText] = useState(current?.colors.join(', ') ?? '');
  const [error, setError] = useState('');
  const [templateAction, setTemplateAction] = useState<'load' | 'save' | null>(null);
  const actor = useSelector((state: RootState) => state.auth.user);
  const [create, { isLoading: creating }] = useCreateProductMutation();
  const [update, { isLoading: updating }] = useUpdateProductMutation();
  const [saveTemplate, { isLoading: savingTemplate }] = useSaveSpecificationTemplateMutation();
  const busy = creating || updating || savingTemplate;
  const navigate = useNavigate();
  const { notify } = useApp();
  const category = categories.find((item) => item.id === form.categoryId);
  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setForm((previous) => ({ ...previous, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError('');
    const product = { ...form, name: form.name.trim(), slug: form.slug.trim(), sku: form.sku.trim(), brand: form.brand.trim(), features: featuresText.split('\n').map((item) => item.trim()).filter(Boolean), colors: [...new Set(colorsText.split(',').map((item) => item.trim()).filter(Boolean))] };
    if (!product.name || !product.categoryId) { setError('Enter the product name and category.'); return; }
    try {
      const saved = current ? await update({ id: current.id, product, files }).unwrap() : await create({ product, files }).unwrap();
      notify(current ? 'Product updated' : 'Product created', saved.name);
      navigate(`${productAdminPath}/${saved.id}`);
    } catch (failure) { setError(catalogError(failure)); }
  };

  const removeExisting = (url: string) => {
    const next = form.images.filter((image) => image !== url);
    setForm((previous) => ({ ...previous, images: next, primaryImage: previous.primaryImage === url ? next[0] ?? (files.length ? 'new:0' : undefined) : previous.primaryImage }));
  };
  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    if (form.primaryImage?.startsWith('new:')) {
      const selected = Number(form.primaryImage.slice(4));
      set('primaryImage', selected === index ? form.images[0] ?? (next.length ? 'new:0' : undefined) : selected > index ? `new:${selected - 1}` : form.primaryImage);
    }
  };

  return <form onSubmit={submit}>
    <fieldset disabled={busy} className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-5">
        <Section title="Product information" description="Give customers the details they need to identify this product.">
          <Field label="Product name *"><input required maxLength={200} className={accessInput} value={form.name} placeholder="e.g. iPhone 16 128GB" onChange={(e) => { const name = e.target.value; setForm((previous) => ({ ...previous, name, slug: !current && previous.slug === slugify(previous.name) ? slugify(name) : previous.slug })); }} /></Field>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Category *"><select required value={form.categoryId || ''} onChange={(e) => set('categoryId', Number(e.target.value))} className={accessInput}><option value="">Choose a category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}{!item.isActive ? ' (hidden)' : ''}</option>)}</select></Field><Field label="SKU / product code"><input maxLength={80} className={accessInput} value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="e.g. IP16-128-BLK" /></Field><Field label="Brand"><input maxLength={100} className={accessInput} value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="e.g. Apple" /></Field><Field label="Model"><input maxLength={160} className={accessInput} value={form.model ?? ''} onChange={(e) => set('model', e.target.value)} /></Field></div>
          <Field label="URL slug *" hint="Use lowercase letters, numbers, and hyphens."><input required maxLength={200} pattern="[a-z0-9]+(-[a-z0-9]+)*" className={accessInput} value={form.slug} onChange={(e) => set('slug', e.target.value.toLowerCase())} /></Field>
          <Field label="Short summary" hint="Shown on product cards."><input maxLength={500} className={accessInput} value={form.summary ?? ''} onChange={(e) => set('summary', e.target.value)} /></Field>
          <Field label="Key features" hint="One feature per line, up to 20 features."><textarea rows={5} className={`${accessInput} h-auto py-3`} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={'128GB storage\n6.1-inch display\nUSB-C charging'} /></Field>
          <Field label="Description"><textarea rows={7} maxLength={30000} className={`${accessInput} h-auto py-3`} value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
        </Section>
        <Section title="Product images" description="Upload up to 6 JPEG, PNG, or WebP images, up to 5 MB each. Choose a primary image for the product card.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{form.images.map((url) => <div key={url} className={`relative overflow-hidden rounded-lg border ${form.primaryImage === url ? 'border-clay ring-1 ring-clay' : 'border-slate-200'}`}><img src={productImageUrl(url)} alt="Product" className="aspect-square w-full object-contain p-2" /><button type="button" aria-label="Remove product image" onClick={() => removeExisting(url)} className="absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-600 shadow"><X size={15} /></button><label className="flex items-center gap-2 border-t p-2 text-xs"><input type="radio" name="primaryImage" checked={form.primaryImage === url} onChange={() => set('primaryImage', url)} />Primary image</label></div>)}{files.map((file, index) => <div key={`${file.name}-${index}`} className={`relative overflow-hidden rounded-lg border ${form.primaryImage === `new:${index}` ? 'border-clay ring-1 ring-clay' : 'border-slate-200'}`}><FilePreview file={file} /><button type="button" aria-label={`Remove ${file.name}`} onClick={() => removeFile(index)} className="absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-600 shadow"><X size={15} /></button><label className="flex items-center gap-2 border-t p-2 text-xs"><input type="radio" name="primaryImage" checked={form.primaryImage === `new:${index}`} onChange={() => set('primaryImage', `new:${index}`)} />Primary image</label></div>)}</div>
          <label className="block rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm"><span className="mb-2 flex items-center gap-2 font-medium"><ImagePlus size={18} />Choose product images</span><input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={form.images.length + files.length >= 6} onChange={(e) => {
            const selected = Array.from(e.target.files ?? []);
            e.target.value = '';
            if (selected.length + form.images.length + files.length > 6) { setError('A product can have up to 6 images.'); return; }
            if (selected.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) { setError('Choose JPEG, PNG, or WebP files up to 5 MB each.'); return; }
            setError(''); setFiles((previous) => [...previous, ...selected]);
            if (!form.primaryImage && selected.length) set('primaryImage', form.images[0] ?? 'new:0');
          }} className="block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2" /></label>
        </Section>
        <Section title="Specifications" description="Create groups such as Display, Power, or Physical details. Each field has its own name and value.">
          <div className="flex flex-wrap gap-2"><button type="button" disabled={!category} className={accessSecondary} onClick={() => setTemplateAction('load')}>Load category template</button>{hasPermission(actor, 'products.update') && <button type="button" disabled={!category || !form.specifications.length} className={accessSecondary} onClick={() => setTemplateAction('save')}>Save fields as category template</button>}</div>
          <ProductSpecificationEditor value={form.specifications} onChange={(groups) => set('specifications', groups)} />
        </Section>
      </div>
      <div className="space-y-5">
        <Section title="Publishing"><Field label="Status"><select value={form.status} onChange={(e) => set('status', e.target.value as ProductInput['status'])} className={accessInput}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></Field><p className="text-xs text-slate-500">Published products appear in the shop when their category is visible. Add a price and at least one image before publishing.</p><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} />Feature on homepage</label></Section>
        <Section title="Pricing · USD"><Field label="Selling price *"><input required type="number" min="0" max="9999999999.99" step="0.01" className={accessInput} value={form.price} onChange={(e) => set('price', Number(e.target.value))} /></Field><Field label="Regular price" hint="Optional original price, shown crossed out when higher than the selling price."><input type="number" min="0" max="9999999999.99" step="0.01" className={accessInput} value={form.regularPrice ?? ''} onChange={(e) => set('regularPrice', e.target.value === '' ? null : Number(e.target.value))} /></Field></Section>
        <Section title="Inventory"><Field label="Availability"><select value={form.stockStatus} onChange={(e) => set('stockStatus', e.target.value as ProductInput['stockStatus'])} className={accessInput}>{Object.entries(stockLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Stock quantity *"><input required type="number" min="0" max="1000000" step="1" value={form.quantity} onChange={(e) => set('quantity', Number(e.target.value))} className={accessInput} /></Field></Section>
        <Section title="Additional details"><Field label="Warranty"><textarea rows={3} maxLength={500} value={form.warranty ?? ''} onChange={(e) => set('warranty', e.target.value)} className={`${accessInput} h-auto py-2`} placeholder="e.g. 1-year official warranty" /></Field><Field label="Available colors" hint="Separate colors with commas."><input value={colorsText} onChange={(e) => setColorsText(e.target.value)} className={accessInput} placeholder="Black, White, Blue" /></Field></Section>
      </div>
    </fieldset>
    <div className="sticky bottom-0 z-10 mt-5 rounded-xl border border-border bg-white/95 p-4 shadow-sm backdrop-blur">{error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}<div className="flex items-center justify-between gap-3"><span className="text-xs text-slate-500">{form.status === 'DRAFT' ? 'Save now and publish when ready.' : 'This product will be visible in the shop.'}</span><div className="flex gap-2"><button type="button" disabled={busy} onClick={() => navigate(productAdminPath)} className={accessSecondary}>Cancel</button><button type="submit" disabled={busy || !categories.length} className={accessButton}><Save size={16} />{busy ? 'Saving…' : current ? 'Save changes' : 'Create product'}</button></div></div></div>
    {templateAction && category && <ConfirmAction title={templateAction === 'load' ? 'Load specification template' : 'Save category template'} confirmLabel={templateAction === 'load' ? 'Load template' : 'Save template'} onClose={() => setTemplateAction(null)} onConfirm={async () => {
      if (templateAction === 'load') set('specifications', structuredClone(category.specificationTemplate ?? starterSpecifications(category.slug)));
      else { await saveTemplate({ id: category.id, specifications: form.specifications }).unwrap(); notify('Template saved', `Specification fields are ready for other ${category.name} products.`); }
    }}>{templateAction === 'load' ? `Replace the current specification fields with the template for ${category.name}? Current specification values will be cleared.` : `Use these group and field names as the template for ${category.name}? Values stay specific to each product. Existing products will keep their current specifications.`}</ConfirmAction>}
  </form>;
}

export default function ProductEditor() {
  const { productId } = useParams();
  const editing = Boolean(productId);
  const productQuery = useGetAdminProductQuery(Number(productId), { skip: !editing });
  const categoryQuery = useGetProductEditorCategoriesQuery();
  const loading = categoryQuery.isLoading || (editing && productQuery.isLoading);
  const failed = categoryQuery.isError || (editing && productQuery.isError);
  return <AccessPage title={editing ? 'Edit product' : 'Create product'} description="Build a product listing with images, pricing, availability, and specifications." action={<Link to={productAdminPath} className={accessSecondary}>All products</Link>}>
    <QueryFeedback loading={loading} failed={failed} retry={() => { void categoryQuery.refetch(); if (editing) void productQuery.refetch(); }} />
    {!loading && !failed && categoryQuery.data && (!editing || productQuery.data) && <>{!categoryQuery.data.length && <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">Create a product category before adding products.</p>}<ProductForm key={productQuery.data?.id ?? 'new'} current={productQuery.data} categories={categoryQuery.data} /></>}
  </AccessPage>;
}
