import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 bg-[#080808] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-white/5">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37] font-mono">
              Curated Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-white mt-1">
              Shop by <span className="font-normal font-serif italic text-[#D4AF37]">Category</span>
            </h2>
          </div>
          <p className="text-xs text-white/50 max-w-sm mt-2 sm:mt-0 font-light">
            Explore certified smartphones, military armor cases, GaN fast chargers, and audiophile gear.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              {/* Circular Container with Dark Luxury Border */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#111111] border border-white/10 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center p-3 transition-all duration-300 transform group-hover:-translate-y-1">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter contrast-105"
                />
                
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Title & Count */}
              <div className="mt-3">
                <h3 className="text-xs font-medium text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-white/30 font-mono mt-0.5 block">
                  {cat.count} items
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
