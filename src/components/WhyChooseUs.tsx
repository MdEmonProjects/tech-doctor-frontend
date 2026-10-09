import React from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  Clock, 
  Award, 
  HeartHandshake, 
  BadgeCheck,
  Cpu,
  Sparkles
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const stats = [
    { number: '10,000+', label: 'Phones Restored & Serviced' },
    { number: '30 Min', label: 'Average Express Turnaround' },
    { number: '100%', label: 'OEM Grade Certified Glass' },
    { number: '4.9 ★', label: 'Over 1,200 Verified Reviews' },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'Lifetime Screen Warranty',
      desc: 'Complete optical and tactile coverage for all screen installations without unexpected fees.',
    },
    {
      icon: Wrench,
      title: 'Micro-Soldering Lab',
      desc: 'Advanced logic board diagnostics, IC chip replacement, and delicate connector repair.',
    },
    {
      icon: Clock,
      title: 'Immediate Turnaround',
      desc: 'Over 90% of screen and battery procedures are completed while you relax in our lounge.',
    },
    {
      icon: Award,
      title: 'Master Technicians',
      desc: 'Continuous certification across Apple, Samsung, and Google flagship hardware architectures.',
    },
    {
      icon: HeartHandshake,
      title: 'Zero Data Loss Policy',
      desc: 'All hardware procedures protect customer personal privacy and internal flash storage.',
    },
    {
      icon: Cpu,
      title: 'Authentic Batteries',
      desc: 'Cycle-matched, high-capacity cells restoring maximum battery life to original standards.',
    },
  ];

  return (
    <section className="py-20 bg-[#080808] border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37] font-mono">
            BENCHMARK OF EXCELLENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Why Discerning Clients <span className="font-serif italic font-normal text-[#D4AF37]">Choose Tech Doctor</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-xl mx-auto font-light">
            We treat mobile devices as high-precision instruments. Every diagnostic step is documented, measured, and verified.
          </p>
        </div>

        {/* 4 Large Metric Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#111111] p-6 rounded-sm border border-white/10 text-center space-y-2 group hover:border-[#D4AF37]/50 transition-colors"
            >
              <div className="text-3xl sm:text-4xl font-light tracking-tight text-[#D4AF37]">
                {stat.number}
              </div>
              <div className="text-xs text-white/60 font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 6 Core Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#111111] rounded-sm p-6 sm:p-8 border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#151515] transition-all space-y-4 shadow-lg group"
            >
              <div className="w-12 h-12 rounded-sm bg-white/5 text-[#D4AF37] border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-colors">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
