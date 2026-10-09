import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Tag, Wrench, ChevronRight } from 'lucide-react';

interface AnnouncementBarProps {
  onBookRepairClick?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onBookRepairClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const announcements = [
    {
      icon: Sparkles,
      text: 'Free Express Delivery on orders over $75',
      action: 'Shop Now',
    },
    {
      icon: Tag,
      text: 'First-time customer? Use code TECHDOCTOR10 for 10% off',
      action: 'Copy Code',
    },
    {
      icon: ShieldCheck,
      text: 'Lifetime Screen Warranty & 1-Year Battery Guarantee',
      action: 'Learn More',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-[#050505] text-[#D4AF37] border-b border-white/5 text-xs py-2 px-4 select-none relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Desktop 3-item Bar */}
        <div className="hidden md:flex items-center justify-between w-full text-[11px] font-medium tracking-wide">
          <div className="flex items-center space-x-2 text-white/80">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Complimentary insured courier delivery on qualifying orders</span>
          </div>

          <div className="flex items-center space-x-2 text-white/90">
            <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              Privilege Offer: <strong className="text-[#D4AF37] font-mono tracking-wider font-bold">TECHDOCTOR10</strong> for 10% saving
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <button 
              onClick={onBookRepairClick}
              className="text-white/80 hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center group font-medium"
            >
              <span>Certified Repair Warranty &amp; Priority Desk</span>
              <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform text-[#D4AF37]" />
            </button>
          </div>
        </div>

        {/* Mobile Rotating Carousel */}
        <div className="flex md:hidden items-center justify-center w-full text-center text-xs">
          <div className="flex items-center space-x-2 animate-fade-in">
            {React.createElement(announcements[currentSlide].icon, {
              className: 'w-3.5 h-3.5 text-[#D4AF37] shrink-0',
            })}
            <span className="truncate text-white/90 font-medium">{announcements[currentSlide].text}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
