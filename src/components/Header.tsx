import { Link } from 'react-router-dom';
import { getNavigationPath } from '../navigation';
import React, { useState } from 'react';
import { 
  Smartphone, 
  Search, 
  Heart, 
  ShoppingBag, 
  Wrench, 
  Menu, 
  X, 
  ChevronDown,
  ChevronRight,
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onBookRepair: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onBookRepair
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#080808]/95 backdrop-blur-md border-b border-white/5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Wordmark & Emblem */}
          <div className="flex items-center space-x-8">
            <Link
              to={getNavigationPath('home')}
              className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-sm bg-[#121212] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all shadow-md">
                <Smartphone className="w-5 h-5 transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-light tracking-[0.2em] text-white">
                  TECH<span className="text-[#D4AF37] font-normal">DOCTOR</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-mono">
                  Smartphones &bull; Repair Atelier
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-0.5 text-[11px] uppercase tracking-[0.2em] font-medium">
              <Link
                to={getNavigationPath('home')}
                className={`px-3 py-2 rounded-sm transition-all cursor-pointer ${
                  currentView === 'home'
                    ? 'text-[#D4AF37] border-b border-[#D4AF37]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>

              {/* Shop with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <Link
                  to={getNavigationPath('shop')}
                  className={`px-3 py-2 rounded-sm transition-all flex items-center space-x-1 cursor-pointer ${
                    currentView === 'shop'
                      ? 'text-[#D4AF37] border-b border-[#D4AF37]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Collection</span>
                  <ChevronDown className="w-3 h-3 text-[#D4AF37]" />
                </Link>

                {/* Dropdown Menu */}
                {shopDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-[#111111] rounded-sm shadow-2xl border border-white/10 py-3 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="px-4 py-1.5 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                      Featured Series
                    </div>
                    <Link to={getNavigationPath('shop', 'iphone')}
                      onClick={() => {
                        setShopDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-white/80 hover:text-[#D4AF37] hover:bg-white/5 flex items-center justify-between cursor-pointer"
                    >
                      <span>Apple iPhone Flagships</span>
                      <span className="text-[10px] text-white/30 font-mono">16 Pro / 15</span>
                    </Link>
                    <Link to={getNavigationPath('shop', 'samsung')}
                      onClick={() => {
                        setShopDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-white/80 hover:text-[#D4AF37] hover:bg-white/5 flex items-center justify-between cursor-pointer"
                    >
                      <span>Samsung Galaxy Ultra</span>
                      <span className="text-[10px] text-white/30 font-mono">S24 / Fold</span>
                    </Link>
                    <Link to={getNavigationPath('shop', 'google-pixel')}
                      onClick={() => {
                        setShopDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-white/80 hover:text-[#D4AF37] hover:bg-white/5 flex items-center justify-between cursor-pointer"
                    >
                      <span>Google Pixel Pro</span>
                      <span className="text-[10px] text-white/30 font-mono">Tensor G4</span>
                    </Link>

                    <div className="my-2 border-t border-white/5"></div>
                    <div className="px-4 py-1.5 text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                      Curated Gear
                    </div>
                    <Link to={getNavigationPath('shop', 'phone-cases')}
                      onClick={() => {
                        setShopDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-white/80 hover:text-[#D4AF37] hover:bg-white/5 cursor-pointer"
                    >
                      Armor &amp; MagSafe Cases
                    </Link>
                    <Link to={getNavigationPath('shop', 'chargers')}
                      onClick={() => {
                        setShopDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-white/80 hover:text-[#D4AF37] hover:bg-white/5 cursor-pointer"
                    >
                      GaN Fast Power Units
                    </Link>
                    <Link to={getNavigationPath('shop', 'audio')}
                      onClick={() => {
                        setShopDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-white/80 hover:text-[#D4AF37] hover:bg-white/5 cursor-pointer"
                    >
                      Acoustic &amp; ANC Earbuds
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to={getNavigationPath('repairs')}
                className={`px-3 py-2 rounded-sm transition-all cursor-pointer ${
                  currentView === 'repairs'
                    ? 'text-[#D4AF37] border-b border-[#D4AF37]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Repair Atelier
              </Link>

              <Link
                to={getNavigationPath('tracking')}
                className={`px-3 py-2 rounded-sm transition-all cursor-pointer ${
                  currentView === 'tracking'
                    ? 'text-[#D4AF37] border-b border-[#D4AF37]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Track Status
              </Link>

              <Link
                to={getNavigationPath('tradein')}
                className={`px-3 py-2 rounded-sm transition-all cursor-pointer ${
                  currentView === 'tradein'
                    ? 'text-[#D4AF37] border-b border-[#D4AF37]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Trade-In
              </Link>

              <Link
                to={getNavigationPath('about')}
                className={`px-3 py-2 rounded-sm transition-all cursor-pointer ${
                  currentView === 'about'
                    ? 'text-[#D4AF37] border-b border-[#D4AF37]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Standards
              </Link>

              <Link
                to={getNavigationPath('contact')}
                className={`px-3 py-2 rounded-sm transition-all cursor-pointer ${
                  currentView === 'contact'
                    ? 'text-[#D4AF37] border-b border-[#D4AF37]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Lounge
              </Link>

              <Link
                to={getNavigationPath('faq')}
                className={`px-3 py-2 rounded-sm transition-all cursor-pointer ${
                  currentView === 'faq'
                    ? 'text-[#D4AF37] border-b border-[#D4AF37]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Right Action Icons & Booking CTA */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-sm text-white/70 hover:text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Search catalog"
              title="Search phones and repairs"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              className="p-2.5 rounded-sm text-white/70 hover:text-[#D4AF37] hover:bg-white/5 transition-colors relative cursor-pointer"
              aria-label="Wishlist"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="p-2.5 rounded-sm text-white/70 hover:text-[#D4AF37] hover:bg-white/5 transition-colors relative cursor-pointer"
              aria-label="Cart"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Gold "Book a Repair" CTA */}
            <button
              onClick={onBookRepair}
              className="hidden sm:flex items-center space-x-2 bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-sm transition-all shadow-lg hover:shadow-[#D4AF37]/20 cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Reserve Repair</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-[#D4AF37] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0D0D] border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link to={getNavigationPath('home')}
            onClick={() => {
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm text-white/80 hover:text-[#D4AF37] font-medium"
          >
            Home
          </Link>
          <Link to={getNavigationPath('shop')}
            onClick={() => {
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-[#D4AF37] font-medium flex justify-between items-center"
          >
            <span>The Collection</span>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>
          <Link to={getNavigationPath('repairs')}
            onClick={() => {
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm text-white/80 hover:text-[#D4AF37] font-medium"
          >
            Repair Atelier
          </Link>
          <Link to={getNavigationPath('tracking')}
            onClick={() => {
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm text-white/80 hover:text-[#D4AF37] font-medium"
          >
            Track Repair Status
          </Link>
          <Link to={getNavigationPath('tradein')}
            onClick={() => {
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm text-white/80 hover:text-[#D4AF37] font-medium"
          >
            Device Trade-In Valuation
          </Link>
          <Link to={getNavigationPath('about')}
            onClick={() => {
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm text-white/80 hover:text-[#D4AF37] font-medium"
          >
            Atelier Standards
          </Link>
          <Link to={getNavigationPath('contact')}
            onClick={() => {
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm text-white/80 hover:text-[#D4AF37] font-medium"
          >
            Lounge &amp; Desk
          </Link>
          <Link to={getNavigationPath('faq')}
            onClick={() => {
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm text-white/80 hover:text-[#D4AF37] font-medium"
          >
            FAQ &amp; Policies
          </Link>

          <div className="pt-2">
            <button
              onClick={() => {
                onBookRepair();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-bold text-xs py-3 rounded-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>RESERVE REPAIR DESK</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
