import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingThreshold = 75;
  const freeShipping = subtotal >= shippingThreshold || subtotal === 0;
  const shippingCost = freeShipping ? 0 : 9.99;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'TECHDOCTOR10') {
      setDiscountPercent(10);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try TECHDOCTOR10');
    }
  };

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
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
                Cart Items ({cart.reduce((c, i) => c + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#141414] border-b border-white/5">
            {freeShipping ? (
              <p className="text-xs font-semibold text-[#D4AF37] flex items-center">
                <Truck className="w-4 h-4 mr-1.5 text-[#D4AF37]" />
                Unlocked: Free Insured Courier Delivery!
              </p>
            ) : (
              <div>
                <p className="text-xs text-neutral-400">
                  Add <strong className="text-[#D4AF37]">${(shippingThreshold - subtotal).toFixed(2)}</strong> more for <strong>Free Express Shipping</strong>
                </p>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-neutral-500 border border-white/5">
                  <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h4 className="text-base font-light text-white">Your cart is empty</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto font-light">
                  Browse our unlocked smartphones, MagSafe cases, and fast chargers.
                </p>
                <button
                  onClick={() => {
                    onContinueShopping();
                  }}
                  className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-all cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex space-x-3.5 p-3 rounded-sm bg-[#141414] border border-white/5"
                >
                  <div className="w-16 h-16 bg-[#0A0A0A] rounded-xs p-1.5 border border-white/5 flex items-center justify-center shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1.5 bg-[#0A0A0A] border border-white/10 rounded-xs p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold px-2 text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#D4AF37] font-mono">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#111111] space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. TECHDOCTOR10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-sm pl-8 pr-3 py-2 text-xs uppercase text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-[#D4AF37] text-xs font-semibold uppercase px-3 py-2 rounded-sm transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {discountPercent > 0 && (
                <p className="text-[11px] text-[#D4AF37] font-medium">
                  ✓ 10% Welcome Discount Applied!
                </p>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-400 font-semibold">{promoError}</p>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-white/5 font-light">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white font-mono">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D4AF37] font-semibold">
                    <span>Privilege Saving (10%):</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Courier:</span>
                  <span className="font-semibold text-white font-mono">
                    {freeShipping ? <strong className="text-[#D4AF37]">FREE</strong> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                  <span className="font-semibold text-white uppercase tracking-wider">Total:</span>
                  <span className="font-bold text-lg text-[#D4AF37] font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onCheckout();
                }}
                className="w-full bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase py-3.5 rounded-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>256-Bit SSL Encrypted Protocol</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
