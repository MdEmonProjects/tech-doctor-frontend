import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { RootState } from '../../app/store';
import { AccessPage, ConfirmAction, QueryFeedback, accessButton, accessInput, accessSecondary } from '../../components/AccessUi';
import CatalogDialog from '../../components/CatalogDialog';
import { catalogError } from '../../components/RepairServiceDialog';
import { hasPermission } from '../../features/auth/permissions';
import { useCreateProductCategoryMutation, useDeleteProductCategoryMutation, useGetAdminProductCategoriesQuery, useUpdateProductCategoryMutation, type ProductCategory, type ProductCategoryInput } from '../../features/productCategories/productCategoriesApi';
import { storefrontCategoryImage } from '../../features/productCategories/storefrontCategories';

function CategoryEditor({ category, onClose }: { category?: ProductCategory; onClose: () => void }) {
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [createCategory, { isLoading: creating }] = useCreateProductCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateProductCategoryMutation();
  const busy = creating || updating;
  useEffect(() => {
    if (!imageFile) { setPreviewUrl(''); return; }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);
  const currentImage = !removeImage && category ? storefrontCategoryImage(category) : '';
  const shownImage = previewUrl || currentImage;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const body: ProductCategoryInput = { name: name.trim(), slug: slug.trim().toLowerCase(), description: description.trim() || undefined, image: imageFile ?? undefined, removeImage, isActive };
    try {
      setError(null);
      if (category) await updateCategory({ id: category.id, ...body }).unwrap();
      else await createCategory(body).unwrap();
      onClose();
    } catch (failure) {
      const message = catalogError(failure);
      setError(message.includes('name must be a string') && message.includes('slug must be a string')
        ? 'The server did not receive the category form. Restart the backend and try again.'
        : message);
    }
  };
  return <CatalogDialog title={category ? 'Edit product category' : 'Add product category'} onClose={() => !busy && onClose()}>
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-semibold text-slate-700">Name *<input required maxLength={120} value={name} onChange={(event) => {
        const next = event.target.value;
        if (!category && slug === name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) setSlug(next.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
        setName(next);
      }} className={accessInput} placeholder="e.g. Smartwatches" /></label>
      <label className="block text-sm font-semibold text-slate-700">URL slug *<input required maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={(event) => setSlug(event.target.value.toLowerCase())} className={accessInput} placeholder="e.g. smartwatches" /><span className="mt-1 block text-xs font-normal text-muted">Used in shop links. Changing it will change the category URL.</span></label>
      <label className="block text-sm font-semibold text-slate-700">Description<textarea maxLength={500} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className={`${accessInput} h-auto py-3`} /></label>
      <div className="space-y-2"><label className="block text-sm font-semibold text-slate-700">Category image<input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
          setError('Choose a JPEG, PNG, or WebP image up to 5 MB.');
          event.target.value = '';
          return;
        }
        setError(null);
        setImageFile(file);
        setRemoveImage(false);
      }} className={`${accessInput} h-auto py-2 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm`} /><span className="mt-1 block text-xs font-normal text-muted">JPEG, PNG, or WebP, up to 5 MB.</span></label>
        {shownImage && <div className="flex items-center gap-4"><img src={shownImage} alt="Category preview" className="size-20 rounded-lg border border-border object-cover" /><button type="button" onClick={() => { setImageFile(null); setRemoveImage(true); if (fileInput.current) fileInput.current.value = ''; }} className={accessSecondary}>Remove image</button></div>}
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="size-4 accent-clay" />Show in shop</label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" disabled={busy} onClick={onClose} className={accessSecondary}>Cancel</button><button type="submit" disabled={busy} className={accessButton}>{busy ? 'Saving…' : category ? 'Save changes' : 'Add category'}</button></div>
    </form>
  </CatalogDialog>;
}

export default function ProductCategories() {
  const actor = useSelector((state: RootState) => state.auth.user);
  const { data: categories = [], isLoading, isError, refetch } = useGetAdminProductCategoriesQuery();
  const [deleteCategory] = useDeleteProductCategoryMutation();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<ProductCategory | null | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<ProductCategory | null>(null);
  const filtered = categories.filter((category) => `${category.name} ${category.slug} ${category.description ?? ''}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <AccessPage title="Product categories" description="Manage the categories customers see while shopping. Repair brands and services are managed separately." action={hasPermission(actor, 'product_categories.create') && <button type="button" onClick={() => setEditing(null)} className={accessButton}><Plus size={17} />Add category</button>}>
    <label className="relative block max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><input aria-label="Search product categories" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories" className={`${accessInput} !mt-0 pl-9`} /></label>
    <QueryFeedback loading={isLoading} failed={isError} retry={() => void refetch()} empty={!filtered.length ? 'No matching product categories.' : undefined} />
    {!isLoading && !isError && filtered.length > 0 && <div className="overflow-x-auto rounded-lg border border-border"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Category</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>{filtered.map((category) => <tr key={category.id} className="border-t border-border"><td className="px-4 py-3"><div className="flex items-center gap-3">{storefrontCategoryImage(category) && <img src={storefrontCategoryImage(category)} alt="" className="size-10 rounded-md border border-border object-cover" />}<div><span className="font-semibold text-foreground">{category.name}</span>{category.description && <p className="max-w-md text-xs text-muted">{category.description}</p>}</div></div></td><td className="px-4 py-3 text-slate-600">{category.slug}</td><td className="px-4 py-3"><span className={category.isActive ? 'text-green-700' : 'text-slate-500'}>{category.isActive ? 'Visible' : 'Hidden'}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-2">{hasPermission(actor, 'product_categories.update') && <button type="button" onClick={() => setEditing(category)} aria-label={`Edit ${category.name}`} className={accessSecondary}><Pencil size={16} /></button>}{hasPermission(actor, 'product_categories.delete') && <button type="button" onClick={() => setDeleteTarget(category)} aria-label={`Delete ${category.name}`} className={`${accessSecondary} text-red-600`}><Trash2 size={16} /></button>}</div></td></tr>)}</tbody></table></div>}
    {editing !== undefined && <CategoryEditor key={editing?.id ?? 'new'} category={editing ?? undefined} onClose={() => setEditing(undefined)} />}
    {deleteTarget && <ConfirmAction title="Delete product category" confirmLabel="Delete category" onClose={() => setDeleteTarget(null)} onConfirm={() => deleteCategory(deleteTarget.id).unwrap()}>Delete <strong>{deleteTarget.name}</strong>? It will disappear from the shop category list.</ConfirmAction>}
  </AccessPage>;
}
