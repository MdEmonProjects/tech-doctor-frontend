import { useMemo, useState } from 'react';
import { FolderCog, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import SortableTable, { type SortableTableColumn } from '../../components/SortableTable';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { hasPermission } from '../../features/auth/permissions';
import { useGetRepairCatalogQuery } from '../../features/repairCatalog/repairCatalogApi';
import { showModal } from '../../utils/ModalControlar';

interface BrandRow { id: number; name: string; modelCount: string; serviceCount: string; }

const columns: SortableTableColumn<BrandRow>[] = [
  { field: 'name', title: 'Brand name', filterable: true, type: 'text' },
  { field: 'modelCount', title: 'Models', hozAlign: 'center' },
  { field: 'serviceCount', title: 'Model service assignments', hozAlign: 'center' },
  { field: 'id', title: 'Action', hozAlign: 'end', render: (row) => <Link to={`/dashboard/repair-service/brands-services/${row.id}`} className="inline-flex rounded-lg border border-clay px-3 py-1.5 text-xs font-semibold text-clay transition hover:bg-clay hover:text-white">View models</Link> },
];

export default function RepairBrandsServices() {
  const canManage = useSelector((state: RootState) => hasPermission(state.auth.user, 'catalog.brands.create'));
  const [search, setSearch] = useState('');
  const { data: catalog = [], isLoading, isError } = useGetRepairCatalogQuery();
  const rows = useMemo<BrandRow[]>(() => catalog.map((brand) => ({
    id: brand.id,
    name: brand.name,
    modelCount: String(brand.models.length),
    serviceCount: String(brand.models.reduce((total, model) => total + model.services.length, 0)),
  })), [catalog]);
  const visibleRows = rows.filter((row) => row.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <header className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-brand-icon-bg text-clay"><FolderCog size={20} /></span><div><h1 className="text-lg font-semibold text-foreground">Repair brands</h1><p className="text-sm text-muted">Add a brand, then manage its models and services.</p></div></div>
          {canManage && <button type="button" onClick={() => showModal('Add repair brand', 'ADD_REPAIR_BRAND')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-clay px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-clay-dark"><Plus size={17} />Add brand</button>}
        </header>
        <div className="space-y-4 p-4 sm:p-6">
          <label className="relative block max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><input aria-label="Search brands" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search brands" className="h-10 w-full rounded-lg border border-border bg-surface px-3 pl-9 text-sm text-foreground outline-none focus:border-clay" /></label>
          {isLoading ? <p className="py-10 text-center text-sm text-muted">Loading brands…</p> : isError ? <p className="py-10 text-center text-sm text-red-600">Could not load repair brands.</p> : visibleRows.length ? <SortableTable columns={columns} data={visibleRows} /> : <div className="py-12 text-center"><p className="font-medium text-foreground">No brands added yet.</p><p className="mt-1 text-sm text-muted">Add a manufacturer to start creating its models.</p></div>}
        </div>
      </section>
    </div>
  );
}
