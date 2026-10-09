import { useApp } from '../context/AppProvider';
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, Sparkles, Check } from 'lucide-react';

const BRANDS = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Tech Doctor', 'Anker', 'Sony'];

export const ShopPage = () => {
  const { wishlist, toggleWishlist: onToggleWishlist, addToCart: onAddToCart, openOverlay } = useApp();
  const onQuickView = (product: Product) => openOverlay(`/products/${product.id}`);
  const [params, setSearchParams] = useSearchParams();
  const selectedCategory = params.get('category') ?? 'all';
  const selectedBrand = params.get('brand') ?? 'all';
  const sortBy = params.get('sort') ?? 'featured';
  const inStockOnly = params.get('inStock') === 'true';
  const requestedPrice = Number(params.get('maxPrice') ?? 1500);
  const priceRange = Number.isFinite(requestedPrice) && requestedPrice >= 0 ? requestedPrice : 1500;
  const updateFilter = (name: string, value: string, defaultValue: string, replace = false) => {
    const next = new URLSearchParams(params);
    if (value === defaultValue) next.delete(name);
    else next.set(name, value);
    setSearchParams(next, { replace });
  };
  const setSelectedCategory = (value: string) => updateFilter('category', value, 'all');
  const setSelectedBrand = (value: string) => updateFilter('brand', value, 'all');
  const setSortBy = (value: string) => updateFilter('sort', value, 'featured');
  const setInStockOnly = (value: boolean) => updateFilter('inStock', String(value), 'false');
  const setPriceRange = (value: number) => updateFilter('maxPrice', String(value), '1500', true);

  const matchesCategory = (product: Product, category: string) => {
    const phoneBrands: Record<string, string> = { iphone: 'Apple', samsung: 'Samsung', 'google-pixel': 'Google' };
    if (category === 'all') return true;
    if (phoneBrands[category]) return product.category === 'smartphones' && product.brand === phoneBrands[category];
    if (category === 'android-phones') return product.category === 'smartphones' && product.brand !== 'Apple';
    return product.category === (category === 'phone-cases' ? 'cases' : category);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (!matchesCategory(product, selectedCategory)) return false;
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;
      if (inStockOnly && !product.inStock) return false;
      if (product.price > priceRange) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [selectedCategory, selectedBrand, sortBy, inStockOnly, priceRange]);

  return (
    <div className="bg-[#080808] min-h-screen text-white py-10 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Breadcrumb / Title */}
        <div className="border-b border-white/5 pb-6">
          <div className="flex items-center space-x-1.5 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTHENTIC ELECTRONICS CATALOG</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Curated <span className="font-serif italic font-normal text-[#D4AF37]">Hardware &amp; Gear</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-light max-w-xl">
            Explore certified unlocked smartphones, acoustic buds, GaN ultra-compact power bricks, and military-grade drop cases.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Filters (3 cols) */}
          <div className="lg:col-span-3 bg-[#111111] p-5 rounded-sm border border-white/10 space-y-6 shadow-xl sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-white">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span>Filters</span>
              </div>
              <button
                onClick={() => {
                  setSearchParams({});
                }}
                className="text-[10px] uppercase font-mono text-[#D4AF37] hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Categories
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] font-mono">({PRODUCTS.length})</span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-mono">
                      ({PRODUCTS.filter((p) => matchesCategory(p, cat.slug)).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Manufacturer
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
                    selectedBrand === 'all'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>All Brands</span>
                </button>
                {BRANDS.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
                      selectedBrand === brand
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{brand}</span>
                    <span className="text-[10px] font-mono">
                      ({PRODUCTS.filter((p) => p.brand === brand).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Filter */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white uppercase tracking-wider">Max Price</span>
                <span className="font-bold text-[#D4AF37] font-mono">${priceRange}</span>
              </div>
              <input
                type="range"
                min="20"
                max="1500"
                step="20"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#D4AF37] bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-3 border-t border-white/5">
              <label className="flex items-center space-x-2 text-xs text-neutral-400 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-xs accent-[#D4AF37] w-3.5 h-3.5"
                />
                <span>In Stock &amp; Ready to Ship Only</span>
              </label>
            </div>

          </div>

          {/* Right Product Grid Area (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Sort Controls Bar */}
            <div className="bg-[#111111] p-3.5 rounded-sm border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-400">
                Displaying <strong className="text-white font-mono">{filteredProducts.length}</strong> items
              </div>

              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs text-neutral-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#181818] border border-white/10 rounded-xs px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="featured" className="bg-[#111]">Featured Selection</option>
                  <option value="price-low" className="bg-[#111]">Price: Low to High</option>
                  <option value="price-high" className="bg-[#111]">Price: High to Low</option>
                  <option value="rating" className="bg-[#111]">Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-[#111111] rounded-sm border border-white/10 p-12 text-center space-y-3">
                <p className="text-sm font-semibold text-white">No products match your current filters.</p>
                <p className="text-xs text-neutral-400">Try broadening your price range or resetting the category selection.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setPriceRange(1500);
                  }}
                  className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-xs transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
