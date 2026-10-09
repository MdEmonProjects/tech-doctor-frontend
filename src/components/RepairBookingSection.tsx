import React, { useState } from 'react';
import { DEVICE_CATALOG, REPAIR_SERVICES, REPAIR_PRICE_ESTIMATES } from '../data/mockData';
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
  const [brand, setBrand] = useState<string>('Apple');
  const [model, setModel] = useState<string>('iPhone 16 Pro');
  const [repairType, setRepairType] = useState<string>(initialService);
  const [serviceMode, setServiceMode] = useState<'in-store' | 'courier-pickup' | 'mail-in'>('in-store');
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState<string>('11:00 AM');
  
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  const availableModels = DEVICE_CATALOG[brand as keyof typeof DEVICE_CATALOG] || DEVICE_CATALOG['Apple'];

  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    const models = DEVICE_CATALOG[newBrand as keyof typeof DEVICE_CATALOG] || [];
    if (models.length > 0) {
      setModel(models[0]);
    }
  };

  const getEstimatedPrice = () => {
    const serviceEstimates = REPAIR_PRICE_ESTIMATES[repairType];
    if (!serviceEstimates) return 69;
    if (serviceEstimates[model]) return serviceEstimates[model];
    return serviceEstimates['default'] || 69;
  };

  const estimatedPrice = getEstimatedPrice();
  const selectedServiceObj = REPAIR_SERVICES.find((s) => s.title === repairType) || REPAIR_SERVICES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedRef = `TD-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(generatedRef);
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccessToast) {
        onSuccessToast(`Repair reservation #${generatedRef} successfully booked!`);
      }
    }, 1000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
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
                  PRIORITY APPOINTMENT RESERVED
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-white">
                  We Have Reserved Your Repair Slot
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
                    {estimatedPrice === 0 ? 'Free Diagnostic' : `$${estimatedPrice}.00`}
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
                  {(['Apple', 'Samsung', 'Google', 'OnePlus', 'Other'] as const).map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => handleBrandChange(b)}
                      className={`p-3 rounded-sm border text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                        brand === b
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm font-bold'
                          : 'bg-[#151515] text-white/70 border-white/5 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {b}
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
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {availableModels.map((m) => (
                        <option key={m} value={m} className="bg-[#111111] text-white">{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/50 mb-1">
                      Repair Issue Needed
                    </label>
                    <select
                      value={repairType}
                      onChange={(e) => setRepairType(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {REPAIR_SERVICES.map((s) => (
                        <option key={s.id} value={s.title} className="bg-[#111111] text-white">{s.title}</option>
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
                      Turnaround: <strong className="text-white/70">{selectedServiceObj.estimatedTime}</strong> &bull; Warranty: <strong className="text-white/70">{selectedServiceObj.warranty}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-white/40 block">Estimated Quote</span>
                    <span className="text-2xl font-light text-[#D4AF37]">
                      {estimatedPrice === 0 ? 'FREE DIAGNOSTIC' : `$${estimatedPrice}.00`}
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C19A2F] disabled:bg-neutral-800 text-black font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-sm shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-black" />
                  <span>{isSubmitting ? 'Reserving...' : 'CONFIRM BENCH RESERVATION'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
