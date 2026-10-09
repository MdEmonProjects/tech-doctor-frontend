import { useApp } from '../context/AppProvider';
import React, { useState } from 'react';
import { STORE_INFO, storeImg } from '../data/mockData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Car, 
  Train, 
  Send, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Wrench,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const ContactPage = () => {
  const { openOverlay, notify } = useApp();
  const onBookRepair = () => openOverlay('/repairs/book');
  const onSuccessToast = (msg: string) => notify('Concierge Inquiry', msg);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Question',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    onSuccessToast('Your concierge inquiry has been transmitted to our master technician desk.');
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white py-12 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FLAGSHIP LOUNGE &bull; DIRECT CONCIERGE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Visit the Tech Doctor <span className="font-serif italic font-normal text-[#D4AF37]">Lounge &amp; Desk</span>
          </h1>
          <p className="text-xs sm:text-base text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Experience our walk-in espresso lounge while our certified hardware engineers diagnose your device in cleanroom isolation.
          </p>
        </div>

        {/* 2-Column Main Layout: Store Info & Interactive Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Store Details & Interactive Lounge Guide */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Store Photo & Live Status Banner */}
            <div className="relative rounded-sm overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={storeImg}
                alt="Tech Doctor Flagship Store"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center space-x-2 bg-[#0c0c0c]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Open Today &bull; 8:30 AM – 7:30 PM</span>
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-xs space-y-1">
                <h3 className="text-base font-semibold text-white">{STORE_INFO.name}</h3>
                <p className="text-neutral-300 font-light">{STORE_INFO.address}, {STORE_INFO.cityStateZip}</p>
              </div>
            </div>

            {/* Quick Contact & Hours Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Direct Communications */}
              <div className="bg-[#111111] border border-white/10 p-5 rounded-sm space-y-3">
                <h4 className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                  DIRECT CHANNELS
                </h4>
                <div className="space-y-2 text-neutral-300">
                  <div className="flex items-center space-x-2.5">
                    <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <a href="tel:+18005558324" className="hover:text-[#D4AF37] transition-colors">
                      {STORE_INFO.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="font-mono text-[11px]">{STORE_INFO.email}</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 font-medium">WhatsApp Priority Desk Active</span>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-[#111111] border border-white/10 p-5 rounded-sm space-y-3">
                <h4 className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                  HOURS OF OPERATION
                </h4>
                <div className="space-y-1.5 text-neutral-300 font-light text-[11px]">
                  {STORE_INFO.hours.map((h, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-neutral-400">{h.days}:</span>
                      <span className="text-white font-mono">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Parking & Metro Transit */}
            <div className="bg-[#111111] border border-white/10 p-5 rounded-sm space-y-3 text-xs">
              <h4 className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                GETTING TO THE ATELIER
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex items-start space-x-2.5">
                  <Car className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Free Parking:</span>
                    <p className="text-neutral-400 text-[11px] font-light mt-0.5 leading-relaxed">
                      {STORE_INFO.parking}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5">
                  <Train className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Metro Transit:</span>
                    <p className="text-neutral-400 text-[11px] font-light mt-0.5 leading-relaxed">
                      {STORE_INFO.transit}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Concierge Message Form */}
          <div className="lg:col-span-6 bg-[#111111] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="border-b border-white/5 pb-4">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#D4AF37]">
                ATELIER CONCIERGE DESK
              </span>
              <h3 className="text-xl font-light text-white mt-1">Send a Direct Message</h3>
              <p className="text-xs text-neutral-400 font-light mt-1">
                Our master technicians answer all hardware and quote inquiries within 30 minutes during operating hours.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] text-white p-3 rounded-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. eleanor@example.com"
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] text-white p-3 rounded-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] text-white p-3 rounded-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] text-white p-3 rounded-sm focus:outline-none"
                    >
                      <option value="General Question">General Question</option>
                      <option value="Repair Quote & Feasibility">Repair Quote &amp; Feasibility</option>
                      <option value="Corporate Fleet Repairs">Corporate Device Fleet</option>
                      <option value="Device Trade-In Valuation">Device Trade-In Valuation</option>
                      <option value="Accessory Inventory Question">Accessory Inventory Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1.5">
                    Your Message / Device Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide your smartphone model, issue description, or any specific requests..."
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] text-white p-3 rounded-sm focus:outline-none placeholder:text-neutral-600"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[11px] text-neutral-500 font-light flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Your contact data is strictly confidential</span>
                  </span>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase px-8 py-3 rounded-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Message</span>
                  </button>
                </div>

              </form>
            ) : (
              <div className="bg-[#141414] border border-emerald-500/30 p-8 rounded-sm text-center space-y-4 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-light text-white">Inquiry Transmitted Successfully</h4>
                <p className="text-xs text-neutral-300 font-light max-w-md mx-auto leading-relaxed">
                  Thank you <strong>{formData.name}</strong>. Our senior hardware desk has received your request regarding <strong>{formData.subject}</strong> and will follow up at {formData.email}.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: 'General Question', message: '' });
                    }}
                    className="bg-white/5 text-white border border-white/10 text-xs px-4 py-2 rounded-sm cursor-pointer"
                  >
                    Send Another Message
                  </button>
                  <button
                    onClick={onBookRepair}
                    className="bg-[#D4AF37] text-black text-xs font-semibold px-4 py-2 rounded-sm uppercase tracking-wider cursor-pointer"
                  >
                    Book a Repair Slot
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
