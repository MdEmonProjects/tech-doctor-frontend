import { useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import { accessButton, accessInput, accessSecondary } from './AccessUi';
import CatalogDialog from './CatalogDialog';
import { catalogError } from './RepairServiceDialog';
import { useGetRepairBranchesQuery, useUpdateRepairMutation, type RepairTicket, type UpdateRepairInput } from '../features/repairs/repairsApi';

export default function RepairEditDialog({ repair, onClose }: { repair: RepairTicket; onClose: () => void }) {
  const [customerName, setCustomerName] = useState(repair.customerName);
  const [phone, setPhone] = useState(repair.phone ?? '');
  const [email, setEmail] = useState(repair.email ?? '');
  const [brand, setBrand] = useState(repair.brand);
  const [model, setModel] = useState(repair.model);
  const [service, setService] = useState(repair.service);
  const [branchId, setBranchId] = useState(repair.branchId ? String(repair.branchId) : '');
  const [serviceMode, setServiceMode] = useState(repair.serviceMode ?? '');
  const [preferredDate, setPreferredDate] = useState(repair.preferredDate ?? '');
  const [preferredTime, setPreferredTime] = useState(repair.preferredTime ?? '');
  const [customerNotes, setCustomerNotes] = useState(repair.customerNotes ?? '');
  const [error, setError] = useState<string | null>(null);
  const { data: branches = [] } = useGetRepairBranchesQuery();
  const [updateRepair, { isLoading }] = useUpdateRepairMutation();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const body: UpdateRepairInput = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      brand: brand.trim(),
      model: model.trim(),
      service: service.trim(),
      branchId: branchId ? Number(branchId) : null,
      serviceMode: serviceMode ? serviceMode as UpdateRepairInput['serviceMode'] : null,
      preferredDate: preferredDate || null,
      preferredTime: preferredTime.trim() || null,
      customerNotes: customerNotes.trim() || null,
    };
    try {
      setError(null);
      await updateRepair({ id: repair.id, body }).unwrap();
      onClose();
    } catch (failure) {
      setError(catalogError(failure));
    }
  };

  const currentBranchMissing = repair.branch && !branches.some((branch) => branch.id === repair.branch?.id);

  return <CatalogDialog title={`Edit ${repair.ticketId}`} onClose={() => !isLoading && onClose()}>
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">Customer name *<input required maxLength={120} value={customerName} onChange={(event) => setCustomerName(event.target.value)} className={accessInput} /></label>
        <label className="text-sm font-semibold text-slate-700">Phone *<input required type="tel" maxLength={25} pattern="\+?[0-9][0-9 ()-]{5,24}" value={phone} onChange={(event) => setPhone(event.target.value)} className={accessInput} /></label>
      </div>
      <label className="block text-sm font-semibold text-slate-700">Email<input type="email" maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} className={accessInput} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">Brand *<input required maxLength={120} value={brand} onChange={(event) => setBrand(event.target.value)} className={accessInput} /></label>
        <label className="text-sm font-semibold text-slate-700">Model *<input required maxLength={160} value={model} onChange={(event) => setModel(event.target.value)} className={accessInput} /></label>
      </div>
      <label className="block text-sm font-semibold text-slate-700">Damage type / service *<input required maxLength={160} value={service} onChange={(event) => setService(event.target.value)} className={accessInput} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">Branch<select value={branchId} onChange={(event) => setBranchId(event.target.value)} className={accessInput}><option value="">Not assigned</option>{currentBranchMissing && <option value={repair.branch!.id}>{repair.branch!.name} (inactive)</option>}{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
        <label className="text-sm font-semibold text-slate-700">Service mode<select value={serviceMode} onChange={(event) => setServiceMode(event.target.value)} className={accessInput}><option value="">Not specified</option><option value="in-store">In store</option><option value="courier-pickup">Courier pickup</option><option value="mail-in">Mail in</option></select></label>
        <label className="text-sm font-semibold text-slate-700">Preferred date<input type="date" value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} className={accessInput} /></label>
        <label className="text-sm font-semibold text-slate-700">Preferred time<input maxLength={30} value={preferredTime} onChange={(event) => setPreferredTime(event.target.value)} className={accessInput} /></label>
      </div>
      <label className="block text-sm font-semibold text-slate-700">Customer notes<textarea maxLength={5000} rows={4} value={customerNotes} onChange={(event) => setCustomerNotes(event.target.value)} className={`${accessInput} h-auto py-3`} /></label>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" disabled={isLoading} onClick={onClose} className={accessSecondary}>Cancel</button><button type="submit" disabled={isLoading} className={accessButton}><Save size={16} />{isLoading ? 'Saving…' : 'Save changes'}</button></div>
    </form>
  </CatalogDialog>;
}
