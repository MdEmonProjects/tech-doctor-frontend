import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Award, 
  Lock, 
  RotateCcw 
} from 'lucide-react';

export const TrustBar: React.FC = () => {
  const benefits = [
    {
      icon: Zap,
      title: '30-Min Fast Repairs',
      subtitle: 'Average walk-in turnaround',
    },
    {
      icon: Award,
      title: 'Authentic Grade Parts',
      subtitle: 'Rigorous 36-point inspection',
    },
    {
      icon: ShieldCheck,
      title: 'Service Warranty',
      subtitle: 'Lifetime screen guarantee',
    },
    {
      icon: Lock,
      title: 'Secure Device Handling',
      subtitle: 'Zero customer data compromise',
    },
    {
      icon: RotateCcw,
      title: '30-Day Easy Returns',
      subtitle: 'On phones &amp; accessories',
    },
  ];

  return (
    <section className="bg-[#0A0A0A] border-b border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3.5 p-3 rounded-sm bg-[#111111]/60 border border-white/5 hover:border-[#D4AF37]/30 hover:bg-[#151515] transition-all group"
            >
              <div className="w-10 h-10 rounded-sm bg-white/5 text-[#D4AF37] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-colors">
                <item.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                  {item.title}
                </h4>
                <p 
                  className="text-[11px] text-white/40 truncate"
                  dangerouslySetInnerHTML={{ __html: item.subtitle }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
