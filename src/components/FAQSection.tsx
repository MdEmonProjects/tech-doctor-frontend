import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-[#080808] border-b border-white/5 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>TRANSPARENCY &amp; PROTOCOLS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Frequently Asked <span className="font-serif italic font-normal text-[#D4AF37]">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-lg mx-auto font-light">
            Everything you need to know about our repair warranties, parts provenance, data security, and dispatch logistics.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="bg-[#111111] rounded-sm border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between space-x-4 cursor-pointer hover:bg-[#151515] transition-colors"
                >
                  <span className="text-xs sm:text-sm font-medium text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-xs bg-white/5 text-[#D4AF37] border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#D4AF37] text-black border-[#D4AF37]' : ''
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-white/60 leading-relaxed font-light border-t border-white/5 pt-3 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
