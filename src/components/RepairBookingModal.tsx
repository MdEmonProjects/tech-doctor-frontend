import React, { useState } from 'react';
import { DEVICE_CATALOG, REPAIR_SERVICES, REPAIR_PRICE_ESTIMATES } from '../data/mockData';
import { X, CheckCircle, Wrench, ShieldCheck, Clock } from 'lucide-react';

interface RepairBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  onSuccessToast?: (msg: string) => void;
}

export const RepairBookingModal: React.FC<RepairBookingModalProps> = ({
  isOpen,
  onClose,
  initialService = 'Screen & OLED Replacement',
  onSuccessToast
}) => {
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 16 Pro');
  const [repairType, setRepairType] = useState(initialService);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const availableModels = DEVICE_CATALOG[brand as keyof typeof DEVICE_CATALOG] || DEVICE_CATALOG['Apple'];

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
        onSuccessToast(`Repair booking #${generatedRef} confirmed!`);
      }
    }, 900);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-[#111111] text-white rounded-sm max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Reserve Bench Appointment
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xs cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSuccess ? (
            /* Success State */
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/40">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-light text-white">Appointment Scheduled</h4>
              <p className="text-xs text-neutral-400">
                Confirmation Number: <strong className="text-[#D4AF37] font-mono">{bookingRef}</strong>
              </p>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Please bring your {brand} {model} to our flagship atelier desk. No prepayment is needed.
              </p>

              <div className="pt-3">
                <button
                  onClick={handleResetAndClose}
                  className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Manufacturer</label>
                  <select
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                      const models = DEVICE_CATALOG[e.target.value as keyof typeof DEVICE_CATALOG] || [];
                      if (models.length > 0) setModel(models[0]);
                    }}
                    className="w-full bg-[#161616] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option className="bg-[#111]">Apple</option>
                    <option className="bg-[#111]">Samsung</option>
                    <option className="bg-[#111]">Google</option>
                    <option className="bg-[#111]">OnePlus</option>
                    <option className="bg-[#111]">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Model</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {availableModels.map((m) => (
                      <option key={m} value={m} className="bg-[#111]">{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1">Issue / Service Required</label>
                <select
                  value={repairType}
                  onChange={(e) => setRepairType(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {REPAIR_SERVICES.map((s) => (
                    <option key={s.id} value={s.title} className="bg-[#111]">{s.title}</option>
                  ))}
                </select>
              </div>

              {/* Estimate Pill */}
              <div className="p-3 bg-[#151515] border border-[#D4AF37]/30 rounded-xs flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px]">Estimated Price</span>
                  <span className="text-base font-bold text-[#D4AF37] font-mono">
                    {estimatedPrice === 0 ? 'Free Diagnostic' : `$${estimatedPrice}.00`}
                  </span>
                </div>
                <div className="text-right text-[11px] text-neutral-400">
                  <span className="flex items-center justify-end"><Clock className="w-3 h-3 mr-1 text-[#D4AF37]" /> {selectedServiceObj.estimatedTime}</span>
                  <span>{selectedServiceObj.warranty} Warranty</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D4AF37] hover:bg-[#C19A2F] disabled:bg-neutral-800 text-black text-xs font-semibold uppercase tracking-wider py-3 rounded-xs shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Reserving...' : 'CONFIRM BENCH RESERVATION'}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Zero Data Loss Policy &bull; Pay After Testing</span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
