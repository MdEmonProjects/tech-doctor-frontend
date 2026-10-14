import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { accessInput, accessSecondary } from './AccessUi';
import type { SpecificationGroup } from '../features/products/productsApi';

export function starterSpecifications(slug: string): SpecificationGroup[] {
  let groups: [string, string[]][];
  if (/iphone|phone|samsung|pixel/.test(slug) && !/case/.test(slug)) groups = [['Display', ['Size', 'Resolution', 'Refresh rate']], ['Performance', ['Processor', 'RAM', 'Storage']], ['Camera', ['Rear camera', 'Front camera']], ['Battery', ['Capacity', 'Charging']], ['Connectivity', ['SIM', 'Network', 'Wi-Fi', 'Bluetooth']]];
  else if (/charg/.test(slug)) groups = [['Power', ['Input', 'Maximum output', 'Charging protocols']], ['Ports', ['USB-C ports', 'USB-A ports', 'Included cable']], ['Physical details', ['Material', 'Dimensions', 'Weight']]];
  else if (/watch/.test(slug)) groups = [['Display', ['Size', 'Type']], ['Features', ['Sensors', 'Water resistance', 'Compatibility']], ['Battery', ['Capacity', 'Battery life']], ['Physical details', ['Case size', 'Strap material', 'Weight']]];
  else if (/case/.test(slug)) groups = [['Compatibility', ['Supported devices', 'MagSafe']], ['Physical details', ['Material', 'Color', 'Protection']]];
  else groups = [['Basic information', ['Type', 'Compatibility']], ['Physical details', ['Dimensions', 'Weight']]];
  return groups.map(([title, labels]) => ({ title, rows: labels.map((label) => ({ label, value: '' })) }));
}

function move<T>(items: T[], index: number, direction: number) {
  const next = [...items];
  [next[index], next[index + direction]] = [next[index + direction], next[index]];
  return next;
}

export default function ProductSpecificationEditor({ value, onChange }: { value: SpecificationGroup[]; onChange: (value: SpecificationGroup[]) => void }) {
  const updateGroup = (index: number, group: SpecificationGroup) => onChange(value.map((item, i) => i === index ? group : item));
  return <div className="space-y-4">
    {value.map((group, index) => <fieldset key={index} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <legend className="px-1 text-xs font-semibold text-slate-500">Group {index + 1}</legend>
      <div className="mb-4 flex items-center gap-2"><input aria-label={`Group ${index + 1} title`} required maxLength={120} value={group.title} onChange={(e) => updateGroup(index, { ...group, title: e.target.value })} placeholder="e.g. Display" className={`${accessInput} !mt-0 font-semibold`} /><button type="button" aria-label={`Move group ${index + 1} up`} disabled={index === 0} onClick={() => onChange(move(value, index, -1))} className={accessSecondary}><ArrowUp size={15} /></button><button type="button" aria-label={`Move group ${index + 1} down`} disabled={index === value.length - 1} onClick={() => onChange(move(value, index, 1))} className={accessSecondary}><ArrowDown size={15} /></button><button type="button" aria-label={`Remove group ${index + 1}`} onClick={() => onChange(value.filter((_, i) => i !== index))} className={`${accessSecondary} text-red-600`}><Trash2 size={15} /></button></div>
      <div className="space-y-3">{group.rows.map((row, rowIndex) => <div key={rowIndex} className="grid items-start gap-2 sm:grid-cols-[1fr_2fr_auto]">
        <input aria-label={`Group ${index + 1} field ${rowIndex + 1} name`} required maxLength={120} value={row.label} onChange={(e) => updateGroup(index, { ...group, rows: group.rows.map((item, i) => i === rowIndex ? { ...item, label: e.target.value } : item) })} placeholder="Specification name" className={`${accessInput} !mt-0`} />
        <textarea aria-label={`Group ${index + 1} field ${rowIndex + 1} value`} maxLength={2000} rows={2} value={row.value} onChange={(e) => updateGroup(index, { ...group, rows: group.rows.map((item, i) => i === rowIndex ? { ...item, value: e.target.value } : item) })} placeholder="Value, e.g. 6.1-inch OLED" className={`${accessInput} !mt-0 h-auto py-2`} />
        <div className="flex gap-1"><button type="button" aria-label={`Move field ${rowIndex + 1} up`} disabled={rowIndex === 0} onClick={() => updateGroup(index, { ...group, rows: move(group.rows, rowIndex, -1) })} className={accessSecondary}><ArrowUp size={14} /></button><button type="button" aria-label={`Remove field ${rowIndex + 1}`} onClick={() => updateGroup(index, { ...group, rows: group.rows.filter((_, i) => i !== rowIndex) })} className={`${accessSecondary} text-red-600`}><Trash2 size={14} /></button></div>
      </div>)}</div>
      <button type="button" disabled={group.rows.length >= 40} onClick={() => updateGroup(index, { ...group, rows: [...group.rows, { label: '', value: '' }] })} className={`${accessSecondary} mt-3 inline-flex items-center gap-2`}><Plus size={15} />Add specification</button>
    </fieldset>)}
    {!value.length && <p className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500">Add a group or load the category template to start defining this product's specifications.</p>}
    <button type="button" disabled={value.length >= 20} onClick={() => onChange([...value, { title: '', rows: [{ label: '', value: '' }] }])} className={`${accessSecondary} inline-flex items-center gap-2`}><Plus size={16} />Add specification group</button>
  </div>;
}
