import React, { useEffect, useState } from 'react';
import { useGetRepairCatalogQuery } from '../features/repairCatalog/repairCatalogApi';
import { useCreateRepairMutation, useGetRepairBranchesQuery } from '../features/repairs/repairsApi';
import { catalogError } from './RepairServiceDialog';
import { 
  Wrench, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Sparkles, 
  Building2, 
  Truck, 
  Send,
  ArrowRight
} from 'lucide-react';

interface RepairBookingSectionProps {
  initialService?: string;
  onSuccessToast?: (msg: string) => void;
}

export const RepairBookingSection: React.FC<RepairBookingSectionProps> = ({
  initialService = 'Screen & OLED Replacement',
  onSuccessToast,
}) => {
  const { data: catalog = [], isLoading: isCatalogLoading } = useGetRepairCatalogQuery();
  const [brandId, setBrandId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);
  const [serviceLinkId, setServiceLinkId] = useState<number | null>(null);
  const [serviceMode, setServiceMode] = useState<'in-store' | 'courier-pickup' | 'mail-in'>('in-store');
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState<string>('11:00 AM');
  
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [branchId, setBranchId] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { data: branches = [] } = useGetRepairBranchesQuery();
  const [createRepair] = useCreateRepairMutation();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  useEffect(() => {
    if (!catalog.length || brandId !== null) return;
    setBrandId(catalog[0].id);
  }, [brandId, catalog]);

  const selectedBrand = catalog.find((entry) => entry.id === brandId) ?? null;
  const availableModels = selectedBrand?.models ?? [];
  const selectedModel = availableModels.find((entry) => entry.id === modelId) ?? null;
  const availableServices = selectedModel?.services ?? [];
  const selectedServiceLink = availableServices.find((entry) => entry.id === serviceLinkId) ?? null;
  const brand = selectedBrand?.name ?? '';
  const model = selectedModel?.name ?? '';
  const repairType = selectedServiceLink?.service.name ?? '';
  const estimatedPrice = selectedServiceLink?.price === null || selectedServiceLink?.price === undefined ? null : Number(selectedServiceLink.price);
  const selectedServiceObj = selectedServiceLink?.service;

  const handleBrandChange = (newBrandId: number) => {
    setBrandId(newBrandId);
    setModelId(null);
    setServiceLinkId(null);
  };

  useEffect(() => {
    if (!availableModels.length) return;
    if (!availableModels.some((entry) => entry.id === modelId)) setModelId(availableModels[0].id);
  }, [availableModels, modelId]);

  useEffect(() => {
    if (!availableServices.length) return;
    const initial = availableServices.find((entry) => entry.service.name === initialService);
    if (!availableServices.some((entry) => entry.id === serviceLinkId)) setServiceLinkId(initial?.id ?? availableServices[0].id);
  }, [availableServices, initialService, serviceLinkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !selectedBrand || !selectedModel || !selectedServiceLink) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const repair = await createRepair({
        customerName: name.trim(), phone: phone.trim(), email: email.trim() || undefined,
        brand, model, service: repairType, serviceMode, preferredDate, preferredTime,
        notes: notes.trim() || undefined, ...(branchId ? { branchId: Number(branchId) } : {}),
      }).unwrap();
      setBookingRef(repair.ticketId);
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccessToast) {
        onSuccessToast(`Repair request #${repair.ticketId} submitted with Pending status.`);
      }
    } catch (failure) {
      setSubmitError(catalogError(failure));
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setBranchId('');
  };

  return (
    <section id="repair-booking-section" className="py-20 bg-[#0A0A0A] border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Estimate &amp; Priority Queue</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Need Your Phone Fixed? <span className="font-serif italic font-normal text-[#D4AF37]">Reserve Your Bench.</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-xl mx-auto font-light">
            Select your brand, model, and issue for transparent upfront pricing. No surprise fees — you only pay once the device is fully tested and verified.
          </p>
        </div>

        {/* Main Booking Container */}
        <div className="bg-[#111111] rounded-sm border border-white/10 shadow-2xl p-6 sm:p-10 max-w-4xl mx-auto relative overflow-hidden">
          
          {isSuccess ? (
            /* Success State */
            <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto border-2 border-[#D4AF37]/40 shadow-lg">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37] font-mono">
                  REPAIR REQUEST RECEIVED
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-white">
                  Your Repair Is Pending Review
                </h3>
                <p className="text-xs text-white/50 max-w-md mx-auto">
                  Booking Confirmation Number:{' '}
                  <strong className="text-[#D4AF37] font-mono text-sm tracking-wider">{bookingRef}</strong>
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#151515] p-5 rounded-sm border border-white/5 text-left text-xs max-w-md mx-auto space-y-2.5">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Device:</span>
                  <span className="font-semibold text-white">{brand} {model}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Service:</span>
                  <span className="font-semibold text-white">{repairType}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Appointment:</span>
                  <span className="font-semibold text-white">{preferredDate} ({preferredTime})</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Mode:</span>
                  <span className="font-semibold text-white capitalize">{serviceMode.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-white/40">Estimated Quote:</span>
                  <span className="font-bold text-[#D4AF37] text-sm">
                    {estimatedPrice === null ? 'Quote on inspection' : estimatedPrice === 0 ? 'Free Diagnostic' : `$${estimatedPrice.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-sm shadow-md transition-all cursor-pointer"
                >
                  Book Another Device
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Device Manufacturer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white flex items-center">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center mr-2">1</span>
                    Select Manufacturer
                  </label>
                  <span className="text-[11px] text-white/40 font-mono">Step 1 of 4</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {isCatalogLoading && <p className="col-span-full py-2 text-xs text-white/50">Loading available devices…</p>}
                  {!isCatalogLoading && catalog.length === 0 && <p className="col-span-full py-2 text-xs text-amber-300">No repair devices are available yet. Please contact the store.</p>}
                  {catalog.map((catalogBrand) => (
                    <button
                      type="button"
                      key={catalogBrand.id}
                      onClick={() => handleBrandChange(catalogBrand.id)}
                      className={`p-3 rounded-sm border text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                        brandId === catalogBrand.id
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm font-bold'
                          : 'bg-[#151515] text-white/70 border-white/5 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {catalogBrand.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Model & Repair Type */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white flex items-center">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center mr-2">2</span>
                    Device Model &amp; Issue
                  </label>
                  <span className="text-[11px] text-white/40 font-mono">Step 2 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-white/50 mb-1">
                      Device Model
                    </label>
                    <select
                      value={modelId ?? ''}
                      onChange={(e) => { setModelId(Number(e.target.value)); setServiceLinkId(null); }}
                      disabled={!availableModels.length || isCatalogLoading}
                      className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {!availableModels.length && <option value="">No models available</option>}
                      {availableModels.map((entry) => (
                        <option key={entry.id} value={entry.id} className="bg-[#111111] text-white">{entry.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/50 mb-1">
                      Repair Issue Needed
                    </label>
                    <select
                      value={serviceLinkId ?? ''}
                      onChange={(e) => setServiceLinkId(Number(e.target.value))}
                      disabled={!availableServices.length || isCatalogLoading}
                      className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {!availableServices.length && <option value="">No repair issues available</option>}
                      {availableServices.map((entry) => (
                        <option key={entry.id} value={entry.id} className="bg-[#111111] text-white">{entry.service.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Real-time Dynamic Estimate Banner */}
                <div className="bg-[#151515] border border-[#D4AF37]/30 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Wrench className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-xs font-semibold text-white">
                        Estimated Cost for {model} ({repairType})
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40">
                      Turnaround: <strong className="text-white/70">{selectedServiceObj?.estimatedTime ?? 'To be confirmed'}</strong> &bull; Warranty: <strong className="text-white/70">{selectedServiceObj?.warranty ?? 'To be confirmed'}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-white/40 block">Estimated Quote</span>
                    <span className="text-2xl font-light text-[#D4AF37]">
                      {estimatedPrice === null ? 'QUOTE ON INSPECTION' : estimatedPrice === 0 ? 'FREE DIAGNOSTIC' : `$${estimatedPrice.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: Service Mode & Preferred Schedule */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white flex items-center">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center mr-2">3</span>
                    Service Option &amp; Schedule
                  </label>
                  <span className="text-[11px] text-white/40 font-mono">Step 3 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceMode('in-store')}
                    className={`p-3.5 rounded-sm border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                      serviceMode === 'in-store'
                        ? 'bg-[#181818] border-[#D4AF37] shadow-sm'
                        : 'bg-[#151515] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">Walk-In Atelier</h4>
                      <p className="text-[10px] text-white/40 mt-0.5">30-min express wait lounge</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceMode('courier-pickup')}
                    className={`p-3.5 rounded-sm border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                      serviceMode === 'courier-pickup'
                        ? 'bg-[#181818] border-[#D4AF37] shadow-sm'
                        : 'bg-[#151515] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">Courier Pickup</h4>
                      <p className="text-[10px] text-white/40 mt-0.5">Door-to-door insured transit</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceMode('mail-in')}
                    className={`p-3.5 rounded-sm border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                      serviceMode === 'mail-in'
                        ? 'bg-[#181818] border-[#D4AF37] shadow-sm'
                        : 'bg-[#151515] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <Send className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">Prepaid Mail-In</h4>
                      <p className="text-[10px] text-white/40 mt-0.5">Free return shipping</p>
                    </div>
                  </button>
                </div>

                {branches.length > 0 && serviceMode === 'in-store' && <div>
                  <label className="block text-[11px] font-medium text-white/50 mb-1">Preferred Branch</label>
                  <select value={branchId} onChange={(event) => setBranchId(event.target.value)} className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]">
                    <option value="">Choose later</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} — {branch.location}</option>)}
                  </select>
                </div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-white/50 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-white/50 mb-1">
                      Preferred Arrival Time
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option className="bg-[#111111]">09:00 AM – 11:00 AM</option>
                      <option className="bg-[#111111]">11:00 AM – 01:00 PM</option>
                      <option className="bg-[#111111]">01:00 PM – 03:00 PM</option>
                      <option className="bg-[#111111]">03:00 PM – 05:00 PM</option>
                      <option className="bg-[#111111]">05:00 PM – 07:00 PM</option>
                    </select>
                  </div>
                </div>
                <textarea rows={3} maxLength={5000} placeholder="Anything else our technician should know? (optional)" value={notes} onChange={(event) => setNotes(event.target.value)} className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]" />
              </div>

              {/* Step 4: Customer Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white flex items-center">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center mr-2">4</span>
                    Customer Contact Information
                  </label>
                  <span className="text-[11px] text-white/40 font-mono">Step 4 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs text-white/50">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>No payment required now. Pay only after inspection.</span>
                </div>

                <div className="w-full sm:w-auto">{submitError && <p role="alert" className="mb-2 text-xs text-red-400">{submitError}</p>}<button
                  type="submit"
                  disabled={isSubmitting || !selectedServiceLink}
                  className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C19A2F] disabled:bg-neutral-800 text-black font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-sm shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-black" />
                  <span>{isSubmitting ? 'Reserving...' : 'CONFIRM BENCH RESERVATION'}</span>
                </button></div>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
