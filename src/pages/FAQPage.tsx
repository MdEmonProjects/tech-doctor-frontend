import { useApp } from '../context/AppProvider';
import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { FAQItem } from '../types';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Wrench, 
  Phone, 
  Mail, 
  ArrowRight,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export const FAQPage = () => {
  const { openOverlay, navigateTo } = useApp();
  const onBookRepair = () => openOverlay('/repairs/book');
  const onContactDesk = () => navigateTo('contact');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-3']);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQS.filter((f) => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#080808] min-h-screen text-white py-12 border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE &bull; CLIENT POLICIES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Frequently Asked <span className="font-serif italic font-normal text-[#D4AF37]">Questions</span>
          </h1>
          <p className="text-xs sm:text-base text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Everything you need to know about our cleanroom repair standards, component calibrations, lifetime warranty pledges, and express shipping.
          </p>

          {/* Search Input */}
          <div className="pt-2 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policies, screens, batteries, warranty..."
              className="w-full bg-[#111111] border border-white/15 focus:border-[#D4AF37] text-white px-4 py-3 pl-10 rounded-sm text-xs focus:outline-none placeholder:text-neutral-500 font-mono"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'repairs', label: 'Hardware & Repairs' },
            { id: 'warranty', label: 'Warranty & Guarantee' },
            { id: 'store', label: 'Lounge & Appointments' },
            { id: 'products', label: 'Data & Products' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#D4AF37] text-black font-bold'
                  : 'bg-[#111111] text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-[#111111] border border-white/10 rounded-sm overflow-hidden transition-all hover:border-white/20"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-xs sm:text-sm font-medium text-white group-hover:text-[#D4AF37]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-neutral-400 font-light leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-[#111111] border border-white/10 rounded-sm p-6 space-y-3">
              <p className="text-xs text-neutral-400">
                No questions found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-xs text-[#D4AF37] underline cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>

        {/* 2 Helpful Pro Tips & First-Aid Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          <div className="bg-[#121212] border border-white/10 p-6 rounded-sm space-y-3">
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                Emergency Water Damage First-Aid
              </h4>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              <strong>DO NOT</strong> plug the device into a charger and <strong>DO NOT</strong> place in rice. Turn off the device immediately and bring it to our ultrasonic bench for moisture evacuation before corrosion sets in.
            </p>
            <button
              onClick={onBookRepair}
              className="text-[#D4AF37] text-xs font-semibold hover:underline flex items-center space-x-1 cursor-pointer pt-1"
            >
              <span>Book Emergency Ultrasonic Slot</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-[#121212] border border-white/10 p-6 rounded-sm space-y-3">
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <FileCheck className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                Zero Data Loss &amp; Privacy Pledge
              </h4>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              We never require your device PIN or lock code for hardware repairs (screens, batteries, charging ports, back glass). Your photos, messages, and banking data remain 100% encrypted.
            </p>
            <button
              onClick={onContactDesk}
              className="text-[#D4AF37] text-xs font-semibold hover:underline flex items-center space-x-1 cursor-pointer pt-1"
            >
              <span>Contact Concierge Desk</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* Contact Help Strip */}
        <div className="bg-[#111111] border border-white/10 rounded-sm p-6 sm:p-8 text-center space-y-4">
          <h3 className="text-lg font-light text-white">Still have questions?</h3>
          <p className="text-xs text-neutral-400 font-light max-w-md mx-auto">
            Our certified hardware technicians are available via direct phone and WhatsApp to discuss your repair requirements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="tel:+18005558324"
              className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs px-6 py-2.5 rounded-sm uppercase tracking-wider transition-all flex items-center space-x-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Technician Hotline</span>
            </a>
            <button
              onClick={onContactDesk}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs px-6 py-2.5 rounded-sm uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Message Concierge Desk</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
