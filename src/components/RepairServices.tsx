import React from 'react';
import { REPAIR_SERVICES, repairBenchImg } from '../data/mockData';
import { 
  Wrench, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

interface RepairServicesProps {
  onSelectService: (serviceTitle: string) => void;
  onBookRepairClick: () => void;
}

export const RepairServices: React.FC<RepairServicesProps> = ({
  onSelectService,
  onBookRepairClick
}) => {
  return (
    <section id="repair-services-section" className="py-16 bg-[#080808] border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-white/5 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Precision Diagnostics &amp; Micro-Soldering</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-white mt-1">
              Expert Repair. <span className="font-normal font-serif italic text-[#D4AF37]">Done Right.</span>
            </h2>
          </div>
          <p className="text-xs text-white/50 max-w-sm font-light">
            All repairs are performed on ESD-safe benches using certified OEM-grade panels, cycle-tested battery cells, and genuine connectors.
          </p>
        </div>

        {/* Highlight Feature Card: Workbench Showcase */}
        <div className="bg-[#111111] rounded-sm border border-white/10 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Image (5 cols) */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
              <img
                src={repairBenchImg}
                alt="Tech Doctor certified repair bench"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs">
                ISO Certified Clean-Bench
              </div>
            </div>

            {/* Content (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
              <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Certified Service Warranty Included</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-light text-white leading-tight">
                Lifetime Screen Guarantee &amp; 1-Year Battery Health Warranty
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                We believe in uncompromising quality. If our installed screen experiences any touch responsiveness or optical anomaly without accidental physical breakage, we replace it free of charge.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="flex items-center space-x-2 text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>30-Min Fast Track</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Zero Data Wipe</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>TrueTone Retained</span>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={onBookRepairClick}
                  className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-sm shadow-md transition-all cursor-pointer flex items-center space-x-2"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>BOOK BENCH APPOINTMENT</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 8 Repair Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REPAIR_SERVICES.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service.title)}
              className="bg-[#111111] rounded-sm p-5 border border-white/10 hover:border-[#D4AF37]/60 hover:bg-[#151515] transition-all flex flex-col justify-between space-y-4 group cursor-pointer shadow-lg"
            >
              <div>
                {/* Top: Icon and Price */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-sm bg-white/5 text-[#D4AF37] border border-white/10 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 flex items-center justify-center transition-colors">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white font-mono bg-white/5 px-2.5 py-1 rounded-sm border border-white/5">
                    {service.startingPrice === 0 ? 'FREE DIAG' : `From $${service.startingPrice}`}
                  </span>
                </div>

                {/* Title and Short Description */}
                <h4 className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors mt-3">
                  {service.title}
                </h4>
                <p className="text-xs text-white/50 line-clamp-2 mt-1 font-light">
                  {service.shortDesc}
                </p>

                {/* Turnaround and Warranty */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-[#D4AF37]" />
                    {service.estimatedTime}
                  </span>
                  <span className="text-[#D4AF37] font-medium font-mono text-[10px]">
                    {service.warranty}
                  </span>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#D4AF37] group-hover:translate-x-0.5 transition-transform">
                <span className="uppercase tracking-wider text-[10px]">Instant Quote &rarr;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
