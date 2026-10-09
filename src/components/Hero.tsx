import React from 'react';
import { 
  Wrench, 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Award,
  ArrowRight
} from 'lucide-react';
import { heroTechImg } from '../data/mockData';

interface HeroProps {
  onBookRepair: () => void;
  onShopPhones: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookRepair, onShopPhones }) => {
  return (
    <section className="relative overflow-hidden bg-[#080808] border-b border-white/5 text-white">
      
      {/* Subtle luxury ambient glow and pattern overlay */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Top Tagline Eyebrow */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[#D4AF37] text-[11px] font-semibold tracking-[0.25em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Smartphones &bull; Precision Repair &bull; Curated Gear</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-white leading-[1.1]">
                Master Craftsmanship.<br />
                <span className="text-[#D4AF37] font-normal italic font-serif">
                  Flawless Performance.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-white/60 font-light max-w-xl leading-relaxed pt-2">
                Certified flagship device sales, precision clean-room screen &amp; battery restoration, and military-grade MagSafe protection — backed by our lifetime craftsmanship guarantee.
              </p>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onBookRepair}
                className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase px-7 py-4 rounded-sm shadow-xl hover:shadow-[#D4AF37]/20 transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
              >
                <Wrench className="w-4 h-4 text-black" />
                <span>RESERVE REPAIR DESK</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onShopPhones}
                className="bg-white/5 hover:bg-white/10 text-white hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/50 font-medium text-xs tracking-wider uppercase px-7 py-4 rounded-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>EXPLORE THE COLLECTION</span>
              </button>
            </div>

            {/* Trust Indicators Bar */}
            <div className="pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-left">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Same-Day Atelier</h4>
                  <p className="text-[10px] text-white/40">30-min express bench</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Lifetime Warranty</h4>
                  <p className="text-[10px] text-white/40">On all certified glass</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Master Technicians</h4>
                  <p className="text-[10px] text-white/40">10,000+ restored</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Studio Composition (5 cols on desktop) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Background Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 via-white/5 to-transparent rounded-2xl transform rotate-1 scale-105 border border-white/5 pointer-events-none" />

            {/* Product Card Container */}
            <div className="relative w-full max-w-md bg-[#111111] rounded-sm p-4 sm:p-6 border border-white/10 shadow-2xl overflow-hidden">
              
              <div className="relative aspect-4/3 w-full flex items-center justify-center overflow-hidden rounded-sm bg-[#080808]/80 border border-white/5">
                <img
                  src={heroTechImg}
                  alt="Flagship smartphones and certified repair tools"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge 1: 30-Min Fix */}
              <div className="absolute -top-3 -right-3 bg-[#161616]/95 backdrop-blur-md border border-[#D4AF37]/40 px-3.5 py-2 rounded-sm shadow-xl flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[11px] font-bold text-white tracking-wide">
                  Express 30-Min Turnaround
                </span>
              </div>

              {/* Floating Badge 2: Diagnostic Guarantee */}
              <div className="absolute -bottom-3 -left-3 bg-[#161616]/95 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-sm shadow-xl flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[11px] font-bold text-white">
                  36-Point Hardware Diagnostics
                </span>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-white/50 border-t border-white/5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#D4AF37]">
                  Tier 1 Certified Lab
                </span>
                <span className="text-[11px] text-white/70">
                  Zero Data Loss Policy
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
