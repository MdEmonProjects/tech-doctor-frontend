import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Check } from 'lucide-react';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, color?: string) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  isInWishlist,
  onToggleWishlist,
  onAddToCart
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors ? product.colors[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-[#111111] text-white rounded-sm max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Image Container (5 cols) */}
            <div className="md:col-span-5 bg-[#080808] rounded-sm p-6 flex flex-col items-center justify-center border border-white/5">
              <div className="w-full aspect-square relative flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-64 object-contain"
                />
              </div>

              {product.badge && (
                <div className="mt-3 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-xs">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Right: Product Details & Purchase Actions (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block">
                  {product.brand} &bull; {product.category.replace('_', ' ')}
                </span>
                <h3 className="text-xl sm:text-2xl font-light text-white mt-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-1.5 mt-2">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {product.rating}
                  </span>
                  <span className="text-xs text-neutral-500">
                    ({product.reviewCount} customer evaluations)
                  </span>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="flex items-baseline space-x-3 py-2 border-y border-white/5">
                <span className="text-2xl font-light text-white tracking-tight font-mono">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-500 line-through font-mono">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded-xs border border-[#D4AF37]/20 flex items-center">
                  <Check className="w-3 h-3 mr-1 text-[#D4AF37]" /> In Stock &amp; Insured
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-white mb-1.5">
                    Finish / Color: <span className="text-neutral-400 font-light">{selectedColor || product.colors[0]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`text-xs px-3 py-1.5 rounded-xs border font-medium transition-all cursor-pointer ${
                          selectedColor === c || (!selectedColor && c === product.colors![0])
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold'
                            : 'bg-[#151515] text-white/70 border-white/10 hover:border-[#D4AF37]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart */}
              <div className="flex items-center space-x-3 pt-2">
                <div className="flex items-center border border-white/10 rounded-sm bg-[#151515]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-neutral-400 hover:text-white font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-neutral-400 hover:text-white font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#C19A2F] text-black text-xs font-semibold uppercase tracking-wider py-3 px-5 rounded-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART (${(product.price * quantity).toFixed(2)})</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-sm border transition-colors cursor-pointer ${
                    isInWishlist
                      ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-white/10 text-neutral-400 hover:text-[#D4AF37] hover:bg-white/5'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-[#D4AF37]' : ''}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] text-neutral-400 font-light">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>{product.warrantyMonths || 12}-Month Guarantee</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Insured Express Courier</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
