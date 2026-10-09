import React, { useState } from 'react';
import { Mail, Gift, Check } from 'lucide-react';

interface NewsletterProps {
  onSuccessToast?: (msg: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onSuccessToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubscribed(true);
    if (onSuccessToast) {
      onSuccessToast('Subscribed! 10% privilege voucher unlocked: TECHDOCTOR10');
    }
  };

  return (
    <section className="bg-[#0A0A0A] py-12 border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] rounded-sm p-6 sm:p-8 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          
          {/* Ambient Gold glow */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Message and Icon */}
          <div className="flex items-center space-x-4 max-w-xl">
            <div className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-light tracking-wide text-white">
                ATELIER PRIVILEGE &amp; RELEASE BULLETINS
              </h3>
              <p className="text-xs text-white/50 mt-0.5 font-light">
                Subscribe for private maintenance briefings, new flagship allocations, and VIP service vouchers.
              </p>
            </div>
          </div>

          {/* Center/Right: Input and Button or Success state */}
          <div className="w-full lg:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="bg-[#161616] border border-[#D4AF37]/40 rounded-sm p-3.5 flex items-center justify-between text-white text-xs font-medium">
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-1.5 text-[#D4AF37]" />
                  Code: <strong className="text-[#D4AF37] ml-1 bg-black px-2 py-0.5 rounded-xs font-mono font-bold">TECHDOCTOR10</strong>
                </span>
                <span className="text-[11px] text-white/50">Unlocked for checkout</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#161616] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] flex-1 font-medium placeholder:text-white/30"
                />
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>

          {/* Right: Small Gift Illustration / Accent */}
          <div className="hidden xl:flex items-center space-x-2 bg-white/5 px-3.5 py-2 rounded-sm border border-white/10">
            <Gift className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-medium text-white">$10 Welcome Voucher</span>
          </div>

        </div>
      </div>
    </section>
  );
};
