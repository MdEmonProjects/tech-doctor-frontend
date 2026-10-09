import { Link } from 'react-router-dom';
import { getNavigationPath } from '../navigation';
import React from 'react';
import { 
  Smartphone, 
  Wrench, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

interface FooterProps {
  onBookRepair: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onBookRepair }) => {
  return (
    <footer className="bg-[#050505] text-neutral-400 text-xs border-t border-white/5">
      
      {/* Top Value Strip inside Footer */}
      <div className="border-b border-white/5 py-8 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h5 className="font-semibold text-white text-xs uppercase tracking-wider">Free Insured Courier</h5>
                <p className="text-[11px] text-neutral-500 font-light">On orders exceeding $75</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <RotateCcw className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h5 className="font-semibold text-white text-xs uppercase tracking-wider">30-Day Easy Returns</h5>
                <p className="text-[11px] text-neutral-500 font-light">Hassle-free guarantee</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h5 className="font-semibold text-white text-xs uppercase tracking-wider">Service Warranty</h5>
                <p className="text-[11px] text-neutral-500 font-light">Lifetime screen &amp; 1-yr battery</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Headphones className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h5 className="font-semibold text-white text-xs uppercase tracking-wider">Priority Support</h5>
                <p className="text-[11px] text-neutral-500 font-light">Always direct to technician</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 5-Column Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand Wordmark & Info */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#121212] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-base font-light tracking-[0.2em] text-white">
                TECH<span className="text-[#D4AF37]">DOCTOR</span>
              </span>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed font-light">
              Specialized atelier for certified smartphone sales, military armor protection, and clean-room mobile device restoration.
            </p>

            <div className="pt-2 flex items-center space-x-2 text-neutral-400">
              <a href="#" className="w-8 h-8 rounded-sm bg-[#121212] border border-white/5 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-sm bg-[#121212] border border-white/5 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-sm bg-[#121212] border border-white/5 hover:border-[#D4AF37] hover:text-[#D4AF37] flex items-center justify-center transition-colors" aria-label="YouTube">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest">
              THE COLLECTION
            </h4>
            <ul className="space-y-2 text-neutral-400 text-xs font-light">
              <li>
                <Link to={getNavigationPath('shop', 'iphone')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Apple iPhone Flagships
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('shop', 'samsung')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Samsung Galaxy Ultra
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('shop', 'google-pixel')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Google Pixel Pro Series
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('shop', 'phone-cases')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  MagSafe Armor Cases
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('shop', 'chargers')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  GaN Fast Power Units
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('shop', 'audio')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  ANC Acoustic Earbuds
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Repair Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest">
              REPAIR ATELIER
            </h4>
            <ul className="space-y-2 text-neutral-400 text-xs font-light">
              <li>
                <Link to={getNavigationPath('repairs')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Screen &amp; OLED Replacement
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('repairs')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Battery Health Swap
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('repairs')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Charging Port &amp; USB-C
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('repairs')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Camera Lens &amp; OIS Sensor
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('repairs')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Water Damage Recovery
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('tracking')} className="text-[#D4AF37] font-semibold hover:underline cursor-pointer">
                  ⚡ Live Cleanroom Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest">
              CLIENT CONCIERGE
            </h4>
            <ul className="space-y-2 text-neutral-400 text-xs font-light">
              <li>
                <Link to={getNavigationPath('contact')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Store Location &amp; Hours
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('tracking')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Track Repair Status
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('tradein')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Device Trade-In &amp; Buyback
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('about')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Warranty Coverage Policy
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('faq')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  FAQ &amp; Knowledge Base
                </Link>
              </li>
              <li>
                <Link to={getNavigationPath('contact')} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Contact Repair Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Store Location & Phone */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest">
              VISIT OUR SHOP
            </h4>
            <div className="text-neutral-400 text-xs space-y-2 font-light">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{STORE_INFO.address}, {STORE_INFO.cityStateZip}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="tel:+18005558324" className="hover:text-[#D4AF37] transition-colors">
                  {STORE_INFO.phone}
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{STORE_INFO.email}</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onBookRepair}
                className="w-full bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase py-2.5 rounded-sm transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Wrench className="w-3.5 h-3.5 text-black" />
                <span>RESERVE REPAIR DESK</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer: Copyright, Privacy & Payment Methods */}
      <div className="border-t border-white/5 py-6 bg-[#030303]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-light">
          <div>
            &copy; {new Date().getFullYear()} Tech Doctor Inc. All rights reserved. Professional Phone Repair &amp; Electronics.
          </div>

          {/* Payment Badges */}
          <div className="flex items-center space-x-2 text-neutral-300">
            <span className="bg-[#111] border border-white/5 px-2 py-1 rounded-xs text-[9px] font-mono font-bold">VISA</span>
            <span className="bg-[#111] border border-white/5 px-2 py-1 rounded-xs text-[9px] font-mono font-bold">MASTERCARD</span>
            <span className="bg-[#111] border border-white/5 px-2 py-1 rounded-xs text-[9px] font-mono font-bold">APPLE PAY</span>
            <span className="bg-[#111] border border-white/5 px-2 py-1 rounded-xs text-[9px] font-mono font-bold">GOOGLE PAY</span>
            <span className="bg-[#111] border border-white/5 px-2 py-1 rounded-xs text-[9px] font-mono font-bold">PAYPAL</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
