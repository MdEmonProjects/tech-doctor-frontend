import React from 'react';
import { Product } from '../types';
import { Star, ShoppingBag, Eye, Heart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView
}) => {
  return (
    <div className="group bg-[#111111] rounded-sm border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_4px_25px_rgba(0,0,0,0.8)] relative">
      
      {/* Top Image Container & Action Overlay */}
      <div className="relative aspect-square w-full bg-[#0B0B0B] p-5 flex items-center justify-center overflow-hidden border-b border-white/5">
        
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-[#D4AF37] text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all cursor-pointer ${
            isInWishlist
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'bg-black/60 text-white/50 hover:text-white hover:bg-black/90'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-black' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="max-h-48 w-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick View Hover Strip */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-black/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
          <button
            onClick={() => onQuickView(product)}
            className="w-full text-center text-[10px] uppercase tracking-widest font-semibold text-white hover:text-[#D4AF37] py-1 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Inspection</span>
          </button>
        </div>

      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#111111]">
        
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-white/40 mb-1">
            <span>{product.brand}</span>
            <span className="text-[#D4AF37] font-semibold">{product.warrantyMonths}M Warranty</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Specs */}
          <p className="text-[11px] text-white/40 line-clamp-1 mt-0.5">
            {product.specs}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mt-2">
            <div className="flex text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-current'
                      : 'text-white/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-white/80">
              {product.rating}
            </span>
            <span className="text-[10px] text-white/30">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-bold text-white tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-white/30 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.inStock && (
              <span className="text-[10px] text-[#D4AF37] font-medium flex items-center mt-0.5">
                <Check className="w-3 h-3 mr-0.5" /> In Stock
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-[#D4AF37] p-2.5 rounded-sm transition-all shadow-xs cursor-pointer"
            aria-label="Add to cart"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
