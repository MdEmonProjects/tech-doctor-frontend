import React from 'react';
import { CUSTOMER_REVIEWS } from '../data/mockData';
import { Star, CheckCircle, Sparkles } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-20 bg-[#0A0A0A] border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-white/5 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VERIFIED REPUTATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-white mt-1">
              Client Testimonials &amp; <span className="font-normal font-serif italic text-[#D4AF37]">Feedback</span>
            </h2>
          </div>

          <div className="flex items-center space-x-2 bg-[#111111] px-4 py-2 rounded-sm border border-white/10">
            <div className="flex text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-white">4.9 / 5.0 Rating</span>
            <span className="text-[11px] text-white/40 font-mono">(&gt;1,200 reviews)</span>
          </div>
        </div>

        {/* 4 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#111111] rounded-sm p-6 border border-white/10 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between space-y-5 shadow-lg group"
            >
              <div className="space-y-3">
                {/* Rating & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/30 font-mono">
                    {rev.date}
                  </span>
                </div>

                {/* Device & Service Tag */}
                <div className="inline-block bg-white/5 text-[#D4AF37] text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-xs border border-white/5">
                  {rev.device} • {rev.serviceOrProduct}
                </div>

                {/* Comment */}
                <p className="text-xs text-white/60 leading-relaxed font-light italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    {rev.author}
                  </h4>
                  <p className="text-[10px] text-white/40">Verified Client</p>
                </div>

                {rev.verified && (
                  <span className="text-[10px] text-white/50 flex items-center">
                    <CheckCircle className="w-3 h-3 text-[#D4AF37] mr-1" /> Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
