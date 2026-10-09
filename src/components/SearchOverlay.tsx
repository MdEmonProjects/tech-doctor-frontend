import React, { useState, useMemo } from 'react';
import { PRODUCTS, REPAIR_SERVICES, CATEGORIES } from '../data/mockData';
import { Product } from '../types';
import { Search, X, Smartphone, Wrench } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectRepair: (repairTitle: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectRepair,
  onSelectCategory
}) => {
  const [query, setQuery] = useState('');

  const matchedProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  const matchedRepairs = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return REPAIR_SERVICES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.shortDesc.toLowerCase().includes(q) ||
        r.popularIssues.some((issue) => issue.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-150">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24">
        <div className="relative bg-[#111111] text-white rounded-sm max-w-2xl w-full shadow-2xl border border-white/10 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
          
          {/* Search Header Input */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center space-x-3 bg-[#141414]">
            <Search className="w-5 h-5 text-[#D4AF37]" />
            <input
              type="text"
              autoFocus
              placeholder="Search iPhones, Galaxy, MagSafe armor, screen repair, batteries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-sm sm:text-base font-medium text-white placeholder:text-neutral-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs font-semibold text-neutral-400 hover:text-white px-2 py-1 bg-white/5 rounded-xs"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xs cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results / Suggestions */}
          <div className="p-5 max-h-[60vh] overflow-y-auto space-y-6">
            
            {query.trim() === '' ? (
              /* Popular Suggestions when query is empty */
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-2.5">
                    Popular Departments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.slice(0, 6).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.slug);
                        }}
                        className="bg-[#161616] hover:bg-[#1f1f1f] hover:text-[#D4AF37] text-xs font-medium text-white/80 px-3 py-1.5 rounded-xs border border-white/5 transition-colors cursor-pointer"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-2.5">
                    Common Repair Solutions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {REPAIR_SERVICES.slice(0, 4).map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          onSelectRepair(r.title);
                        }}
                        className="text-left p-2.5 rounded-xs bg-[#161616] hover:bg-[#1f1f1f] border border-white/5 text-xs font-medium text-white flex items-center justify-between group cursor-pointer"
                      >
                        <span className="flex items-center space-x-2">
                          <Wrench className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{r.title}</span>
                        </span>
                        <span className="text-[11px] text-[#D4AF37] font-mono">
                          {r.startingPrice === 0 ? 'Free' : `From $${r.startingPrice}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : matchedProducts.length === 0 && matchedRepairs.length === 0 ? (
              /* No Results */
              <div className="text-center py-10 space-y-2">
                <p className="text-sm font-semibold text-white">
                  No exact matches found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-neutral-400">
                  Try searching for &quot;iPhone&quot;, &quot;Screen&quot;, &quot;Charger&quot;, or &quot;Battery&quot;.
                </p>
              </div>
            ) : (
              /* Matched Results */
              <div className="space-y-6">
                
                {/* Matched Products */}
                {matchedProducts.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-3">
                      Products &amp; Gear ({matchedProducts.length})
                    </h4>
                    <div className="space-y-2">
                      {matchedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            onSelectProduct(prod);
                          }}
                          className="flex items-center justify-between p-3 rounded-xs bg-[#161616] hover:bg-[#1f1f1f] border border-white/5 hover:border-[#D4AF37]/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-12 h-12 bg-[#0A0A0A] rounded-xs p-1 border border-white/5 flex items-center justify-center shrink-0">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-xs font-semibold text-white group-hover:text-[#D4AF37] truncate">
                                {prod.name}
                              </h5>
                              <p className="text-[11px] text-neutral-400 truncate">
                                {prod.specs}
                              </p>
                            </div>
                          </div>

                          <div className="text-right pl-3 shrink-0">
                            <span className="text-xs font-mono font-bold text-white">
                              ${prod.price.toFixed(2)}
                            </span>
                            <span className="block text-[10px] text-[#D4AF37] font-semibold">
                              Inspect Item &rarr;
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Repair Services */}
                {matchedRepairs.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-3">
                      Atelier Solutions ({matchedRepairs.length})
                    </h4>
                    <div className="space-y-2">
                      {matchedRepairs.map((rep) => (
                        <div
                          key={rep.id}
                          onClick={() => {
                            onSelectRepair(rep.title);
                          }}
                          className="flex items-center justify-between p-3 rounded-xs bg-[#161616] hover:bg-[#1f1f1f] border border-white/5 hover:border-[#D4AF37]/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xs bg-[#0A0A0A] border border-white/5 text-[#D4AF37] flex items-center justify-center shrink-0">
                              <Wrench className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold text-white group-hover:text-[#D4AF37]">
                                {rep.title}
                              </h5>
                              <p className="text-[11px] text-neutral-400 font-light">
                                {rep.estimatedTime} &bull; {rep.warranty}
                              </p>
                            </div>
                          </div>

                          <div className="text-right pl-3 shrink-0">
                            <span className="text-xs font-bold text-[#D4AF37] font-mono">
                              {rep.startingPrice === 0 ? 'FREE' : `From $${rep.startingPrice}`}
                            </span>
                            <span className="block text-[10px] text-neutral-400">
                              Reserve &rarr;
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Search Footer */}
          <div className="p-3 bg-[#141414] border-t border-white/10 text-center text-[11px] text-neutral-500 font-mono">
            Press <kbd className="px-1.5 py-0.5 bg-black border border-white/10 rounded font-mono text-[10px] text-white">ESC</kbd> to exit search
          </div>

        </div>
      </div>
    </div>
  );
};
