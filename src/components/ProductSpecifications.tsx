import type { SpecificationGroup } from '../features/products/productsApi';

export default function ProductSpecifications({ groups, dark = false }: { groups: SpecificationGroup[]; dark?: boolean }) {
  return <div className="space-y-4">{groups.map((group, index) => <section key={index} className={`overflow-hidden rounded-lg border ${dark ? 'border-white/10' : 'border-slate-200'}`}>
    <h3 className={`px-4 py-3 text-sm font-semibold ${dark ? 'bg-white/5 text-[#D4AF37]' : 'bg-slate-50 text-slate-800'}`}>{group.title}</h3>
    <dl>{group.rows.map((row, rowIndex) => <div key={rowIndex} className={`grid gap-2 border-t px-4 py-3 text-sm sm:grid-cols-[180px_1fr] ${dark ? 'border-white/10' : 'border-slate-100'}`}><dt className={dark ? 'text-white/50' : 'text-slate-500'}>{row.label}</dt><dd className="whitespace-pre-wrap break-words">{row.value || '—'}</dd></div>)}</dl>
  </section>)}</div>;
}
