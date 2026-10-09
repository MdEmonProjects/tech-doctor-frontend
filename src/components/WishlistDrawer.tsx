import React from 'react';
import { Product } from '../types';
import { X, Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D0D0D] text-white shadow-2xl flex flex-col justify-between border-l border-white/10">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111111]">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
                Saved Wishlist ({wishlist.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-neutral-500 border border-white/5">
                  <Heart className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h4 className="text-base font-light text-white">No saved items yet</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto font-light">
                  Click the heart icon on any flagship phone, armor case, or charger to save for later.
                </p>
              </div>
            ) : (
              wishlist.map((prod) => (
                <div
                  key={prod.id}
                  className="flex space-x-3.5 p-3 rounded-sm bg-[#141414] border border-white/5"
                >
                  <div className="w-16 h-16 bg-[#0A0A0A] rounded-xs p-1.5 border border-white/5 flex items-center justify-center shrink-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {prod.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(prod)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-[#D4AF37] font-mono mt-0.5">
                        ${prod.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => {
                          onAddToCart(prod);
                          onRemoveFromWishlist(prod);
                        }}
                        className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-xs transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-white/10 bg-[#111111]">
            <button
              onClick={onClose}
              className="w-full bg-white/5 hover:bg-white/10 text-white hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37] font-medium text-xs tracking-wider uppercase py-3 rounded-sm transition-all cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
