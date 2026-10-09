import React from 'react';
import { promoDealImg, promoArrivalImg } from '../data/mockData';
import { ArrowRight, Tag, Sparkles } from 'lucide-react';

interface PromoBannersProps {
  onRepairDealsClick: () => void;
  onNewArrivalsClick: () => void;
}

export const PromoBanners: React.FC<PromoBannersProps> = ({
  onRepairDealsClick,
  onNewArrivalsClick
}) => {
  return (
    <section className="py-12 bg-[#080808] border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Banner 1: Repair Privilege Offer */}
          <div className="relative rounded-sm bg-[#111111] border border-white/10 p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl group hover:border-[#D4AF37]/50 transition-all duration-300">
            
            {/* Subtle background image */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 group-hover:opacity-35 transition-opacity">
              <img
                src={promoDealImg}
                alt="Audiophile mobile tech"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter grayscale contrast-125"
              />
            </div>

            <div className="relative z-10 space-y-4 max-w-sm">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
                <Tag className="w-3.5 h-3.5" />
                <span>ATELIER PRIVILEGE</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-light text-white leading-tight">
                Battery Health &amp; Screen Bundle <span className="font-normal font-serif italic text-[#D4AF37]">Offer</span>
              </h3>

              <p className="text-xs text-white/50 leading-relaxed font-light">
                Combine a display replacement with a certified battery swap and receive 20% savings on the complete overhaul.
              </p>

              <div className="pt-2">
                <button
                  onClick={onRepairDealsClick}
                  className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer group/btn"
                >
                  <span>CLAIM BUNDLE QUOTE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
              <span>*Terms applied at checkout</span>
              <span className="font-mono text-[#D4AF37] font-semibold">CODE: DUALFIX20</span>
            </div>
          </div>

          {/* Banner 2: Flagship Curations */}
          <div className="relative rounded-sm bg-[#131313] border border-white/10 p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl group hover:border-[#D4AF37]/50 transition-all duration-300">
            
            {/* Subtle background image */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 group-hover:opacity-35 transition-opacity">
              <img
                src={promoArrivalImg}
                alt="New smartphone releases"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter grayscale contrast-125"
              />
            </div>

            <div className="relative z-10 space-y-4 max-w-sm">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEW ARRIVALS</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-light text-white leading-tight">
                iPhone 16 Pro &amp; <span className="font-normal font-serif italic text-[#D4AF37]">S24 Ultra Editions</span>
              </h3>

              <p className="text-xs text-white/50 leading-relaxed font-light">
                Unlocked, sealed, and backed with a 1-year Tech Doctor comprehensive warranty. Includes complementary glass shield.
              </p>

              <div className="pt-2">
                <button
                  onClick={onNewArrivalsClick}
                  className="bg-white/5 hover:bg-white/10 text-white hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37] font-medium text-xs tracking-wider uppercase px-6 py-3 rounded-sm transition-all flex items-center space-x-2 cursor-pointer group/btn"
                >
                  <span>EXPLORE FLAGSHIPS</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
              <span>Free Express Insured Dispatch</span>
              <span className="font-mono text-[#D4AF37] font-semibold">12-MONTH PLEDGE</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
