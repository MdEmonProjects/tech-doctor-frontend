import React, { useState } from 'react';
import { STORE_INFO, storeImg } from '../data/mockData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Navigation, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface StoreContactProps {
  onSuccessToast?: (msg: string) => void;
}

export const StoreContact: React.FC<StoreContactProps> = ({ onSuccessToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Screen Repair Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitted(true);
    if (onSuccessToast) {
      onSuccessToast('Message received! Our bench technician will respond shortly.');
    }
  };

  return (
    <section id="store-contact-section" className="py-20 bg-[#080808] border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PHYSICAL ATELIER &amp; LOUNGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Visit Tech Doctor <span className="font-serif italic font-normal text-[#D4AF37]">Lounge &amp; Desk</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-lg mx-auto font-light">
            Walk into our flagship store for immediate device inspection, premium accessory fittings, or relax while your phone is repaired.
          </p>
        </div>

        {/* 2-Column Store Details + Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Store Location Card (6 cols) */}
          <div className="lg:col-span-6 bg-[#111111] rounded-sm border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            
            {/* Store Photo */}
            <div className="relative h-52 rounded-sm overflow-hidden border border-white/5 bg-[#0A0A0A]">
              <img
                src={storeImg}
                alt="Tech Doctor physical flagship store"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 bg-[#D4AF37] text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs">
                Walk-Ins Welcome &bull; No Appointment Needed
              </div>
            </div>

            {/* Info Items */}
            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3 text-white/80">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Address</h4>
                  <p className="text-white/50">{STORE_INFO.address}, {STORE_INFO.cityStateZip}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-white/80">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Opening Hours</h4>
                  {STORE_INFO.hours.map((h, i) => (
                    <p key={i} className="text-white/50">{h.days}: {h.time}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-start space-x-3 text-white/80">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Direct Line</h4>
                  <a href={`tel:${STORE_INFO.phone}`} className="text-[#D4AF37] font-semibold hover:underline">
                    {STORE_INFO.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-white/5 flex items-center space-x-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-white/5 hover:bg-white/10 text-white hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37] font-medium text-xs tracking-wider uppercase py-3 rounded-sm text-center transition-all flex items-center justify-center space-x-2"
              >
                <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>GET GPS DIRECTIONS</span>
              </a>
            </div>

          </div>

          {/* Contact Message Form (6 cols) */}
          <div className="lg:col-span-6 bg-[#111111] rounded-sm border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37] font-mono">
                DIRECT INQUIRY
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-white mt-1">
                Ask a Master Technician
              </h3>
              <p className="text-xs text-white/50 mt-1 font-light">
                Have a specialized micro-soldering, water damage, or enterprise fleet inquiry? Send us a message directly.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto border-2 border-[#D4AF37]/40">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-light text-white">Message Transmitted</h4>
                <p className="text-xs text-white/50 max-w-xs mx-auto">
                  A certified bench specialist has received your inquiry and will reply shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-white/50 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Alexander"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-white/50 mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="alexander@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/50 mb-1">Inquiry Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option className="bg-[#111111]">Screen &amp; OLED Replacement</option>
                    <option className="bg-[#111111]">Battery Swap &amp; Calibration</option>
                    <option className="bg-[#111111]">Water Damage Recovery Protocol</option>
                    <option className="bg-[#111111]">Enterprise Fleet Maintenance</option>
                    <option className="bg-[#111111]">General Hardware Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/50 mb-1">Device Details &amp; Issue *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide your smartphone model and describe symptoms..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase py-3 rounded-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT INQUIRY</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
