import React, { useState } from 'react';
import { useStoreProducts } from '../features/products/productsApi';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedProductsProps {
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onViewAllClick: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onViewAllClick
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'flagships' | 'accessories' | 'chargers'>('all');
  const { products, isLoading, isError, refetch } = useStoreProducts();

  const filteredProducts = products.filter((product) => {
    if (!product.isFeatured) return false;
    if (activeTab === 'flagships') return ['smartphones', 'iphone', 'samsung', 'google-pixel', 'android-phones'].includes(product.category);
    if (activeTab === 'accessories') return ['cases', 'phone-cases', 'audio'].includes(product.category);
    if (activeTab === 'chargers') return product.category === 'chargers';
    return true;
  });

  return (
    <section className="py-16 bg-[#0A0A0A] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/5 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Flagships &amp; Premium Gear</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-white mt-1">
              Featured <span className="font-normal font-serif italic text-[#D4AF37]">Collection</span>
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#111111] p-1 rounded-sm border border-white/5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xs text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab('flagships')}
              className={`px-3.5 py-1.5 rounded-xs text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                activeTab === 'flagships'
                  ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Smartphones
            </button>
            <button
              onClick={() => setActiveTab('accessories')}
              className={`px-3.5 py-1.5 rounded-xs text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                activeTab === 'accessories'
                  ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Cases &amp; Audio
            </button>
            <button
              onClick={() => setActiveTab('chargers')}
              className={`px-3.5 py-1.5 rounded-xs text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                activeTab === 'chargers'
                  ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              GaN Chargers
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading && <p role="status" className="py-6 text-center text-sm text-white/50">Loading featured products…</p>}
        {isError && <p role="alert" className="py-6 text-center text-sm text-red-400">Could not load products. <button type="button" onClick={() => void refetch()} className="underline">Try again</button></p>}
        {!isLoading && !isError && !filteredProducts.length && <p className="py-6 text-center text-sm text-white/50">No featured products in this selection yet.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInWishlist={wishlist.some((w) => w.id === product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-sm bg-white/5 hover:bg-white/10 text-white hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37] font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer group"
          >
            <span>VIEW COMPLETE CATALOG</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
