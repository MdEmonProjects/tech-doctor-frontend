import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, CheckCircle, Lock, Truck, CreditCard } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onClearCart: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onClearCart,
  onSuccessToast
}) => {
  const [step, setStep] = useState<'shipping' | 'confirmation'>('shipping');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.0825;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedOrder = `ORD-TD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setIsProcessing(false);
      setStep('confirmation');
      onClearCart();
      if (onSuccessToast) {
        onSuccessToast(`Order #${generatedOrder} confirmed! Thank you.`);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-[#111111] text-white rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {step === 'confirmation' ? 'Order Confirmed' : 'Insured Express Checkout'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xs cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 'confirmation' ? (
            /* Confirmation Step */
            <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto border-2 border-[#D4AF37]/40">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                  TRANSACTION VERIFIED
                </span>
                <h3 className="text-2xl font-light text-white mt-1">
                  Payment Confirmed
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Order reference number: <strong className="text-[#D4AF37] font-mono">{orderNumber}</strong>
                </p>
                <p className="text-xs text-neutral-400 mt-2">
                  A receipt and courier tracking details have been sent to <strong>{email || 'your email'}</strong>.
                </p>
              </div>

              <div className="p-4 bg-[#151515] rounded-xs border border-white/5 text-xs text-neutral-400 max-w-md mx-auto text-left space-y-1.5">
                <p className="font-semibold text-white flex items-center">
                  <Truck className="w-4 h-4 text-[#D4AF37] mr-1.5" />
                  Estimated Delivery: 2–3 Business Days
                </p>
                <p className="text-[11px] font-light">
                  All shipments are fully insured and packed in tamper-evident security boxes.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-xs transition-all shadow-md cursor-pointer"
                >
                  Return to Collection
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePlaceOrder} className="py-5 space-y-6">
              
              {/* Customer Contact & Shipping */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-white tracking-wider flex items-center">
                  <Truck className="w-4 h-4 text-[#D4AF37] mr-1.5" />
                  1. Dispatch Address
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Alexander"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Hayes"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Email for Receipt &amp; Tracking *</label>
                  <input
                    type="email"
                    required
                    placeholder="alexander@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#151515] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="742 Evergreen Terrace"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#151515] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Postal / ZIP Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="10012"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-[#151515] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Simulated Integration */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h4 className="text-xs font-semibold uppercase text-white tracking-wider flex items-center">
                  <CreditCard className="w-4 h-4 text-[#D4AF37] mr-1.5" />
                  2. Payment Method
                </h4>

                <div className="bg-[#151515] p-3 rounded-xs border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Credit / Debit Card or Apple Pay</span>
                    <span className="text-[10px] text-[#D4AF37] font-mono font-bold bg-black px-2 py-0.5 rounded-xs border border-[#D4AF37]/30">
                      Sandbox Simulation
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="•••• •••• •••• 4242"
                        defaultValue="4242 •••• •••• 4242"
                        className="w-full bg-[#0E0E0E] border border-white/10 rounded-xs px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        className="w-full bg-[#0E0E0E] border border-white/10 rounded-xs px-3 py-2 text-xs text-center font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary & Submit */}
              <div className="bg-[#151515] rounded-xs p-4 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Items ({cart.reduce((c, i) => c + i.quantity, 0)}):</span>
                  <span className="font-semibold text-white font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Insured Courier:</span>
                  <span className="font-semibold text-white font-mono">
                    {shipping === 0 ? <span className="text-[#D4AF37]">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Estimated Tax:</span>
                  <span className="font-semibold text-white font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                  <span className="font-semibold text-white uppercase tracking-wider">Total Due:</span>
                  <span className="font-bold text-lg text-[#D4AF37] font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#D4AF37] hover:bg-[#C19A2F] disabled:bg-neutral-800 text-black font-semibold text-xs tracking-wider uppercase py-3.5 rounded-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Processing Secure Transmission...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-black" />
                    <span>PAY ${total.toFixed(2)} &amp; COMPLETE ORDER</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-neutral-500 font-light">
                🛡️ 30-Day Money-Back Guarantee &bull; 1-Year Tech Doctor Warranty
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
