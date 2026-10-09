import { useApp } from '../context/AppProvider';
import React from 'react';
import { repairBenchImg, storeImg } from '../data/mockData';
import { 
  ShieldCheck, 
  Award, 
  Wrench, 
  CheckCircle, 
  Users, 
  Sparkles,
  Zap,
  MapPin,
  Clock
} from 'lucide-react';

export const AboutPage = () => {
  const { openOverlay, navigateTo } = useApp();
  const onBookRepair = () => openOverlay('/repairs/book');
  const onExploreCatalog = () => navigateTo('shop');
  return (
    <div className="bg-[#080808] min-h-screen text-white py-12 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ESTABLISHED 2018 &bull; PRECISION ATELIER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            The Standard in <span className="font-serif italic font-normal text-[#D4AF37]">Mobile Craftsmanship</span>
          </h1>
          <p className="text-xs sm:text-base text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Tech Doctor was founded on a simple conviction: mobile technology is an indispensable personal tool that deserves surgical precision, authentic components, and total data privacy.
          </p>
        </div>

        {/* 2-Column Story Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37] font-mono">
              OUR MISSION &amp; PHILOSOPHY
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-white leading-tight">
              Bridging Master Technicians with Authentic Flagship Hardware
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Unlike quick kiosk operators who cut corners with low-grade glass and recycled battery cells, Tech Doctor operates clean-room bench facilities equipped with digital microscopes, ESD flooring, and automated seal repressurization chambers.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Every screen we install retains true color calibration (TrueTone, 120Hz ProMotion), and every battery is cycle-tested before leaving our bench.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border border-white/10 bg-[#111111] p-4 rounded-sm">
                <div className="text-2xl font-light text-[#D4AF37]">10,000+</div>
                <div className="text-xs text-neutral-400 mt-1">Smartphones Restored</div>
              </div>
              <div className="border border-white/10 bg-[#111111] p-4 rounded-sm">
                <div className="text-2xl font-light text-[#D4AF37]">100%</div>
                <div className="text-xs text-neutral-400 mt-1">Zero Data Loss Record</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative rounded-sm overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={repairBenchImg}
              alt="Tech Doctor bench"
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xs p-4 rounded-sm border border-white/10 flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">Cleanroom Micro-Soldering Station</span>
              <span className="text-[#D4AF37] font-mono text-[10px] font-bold uppercase">ISO 9001 Protocol</span>
            </div>
          </div>

        </div>

        {/* 4 Pillars of Excellence */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-light text-white">Our Four Core Commitments</h3>
            <p className="text-xs text-neutral-400 mt-1 font-light">The fundamental rules our technicians and concierges uphold daily.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#111111] p-6 rounded-sm border border-white/10 space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              <h4 className="text-sm font-semibold text-white">Lifetime Warranty</h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                If our screen panel malfunctions optically or fails touch responsiveness without physical impact, replacement is instantaneous and free.
              </p>
            </div>

            <div className="bg-[#111111] p-6 rounded-sm border border-white/10 space-y-3">
              <Award className="w-6 h-6 text-[#D4AF37]" />
              <h4 className="text-sm font-semibold text-white">Master Technicians</h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Each technician completes rigorous internal testing in micro-soldering, board level diagnostics, and component calibration.
              </p>
            </div>

            <div className="bg-[#111111] p-6 rounded-sm border border-white/10 space-y-3">
              <Zap className="w-6 h-6 text-[#D4AF37]" />
              <h4 className="text-sm font-semibold text-white">Express Turnaround</h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                We respect your busy routine. Most screen and battery services are completed within 30 minutes in our comfortable atelier.
              </p>
            </div>

            <div className="bg-[#111111] p-6 rounded-sm border border-white/10 space-y-3">
              <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
              <h4 className="text-sm font-semibold text-white">Data Privacy Protection</h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                We never request customer lock screen passwords unless hardware testing explicitly requires it with your signed permission.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="bg-[#111111] rounded-sm p-8 sm:p-12 border border-white/10 text-center space-y-6 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-light text-white">
            Experience the Tech Doctor Distinction
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto font-light">
            Visit our flagship atelier or order certified phones and accessories with free insured courier dispatch.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <button
              onClick={onBookRepair}
              className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-sm shadow-md transition-all cursor-pointer"
            >
              BOOK BENCH REPAIR
            </button>
            <button
              onClick={onExploreCatalog}
              className="bg-white/5 hover:bg-white/10 text-white hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37] font-medium text-xs tracking-wider uppercase px-8 py-3.5 rounded-sm transition-all cursor-pointer"
            >
              EXPLORE CATALOG
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
