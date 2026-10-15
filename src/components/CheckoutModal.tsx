import React, { useRef, useState } from 'react';
import { CartItem } from '../types';
import { X, CheckCircle, Lock, Truck, CreditCard } from 'lucide-react';
import { useCheckoutOrderMutation } from '../features/orders/ordersApi';
import { catalogError } from './RepairServiceDialog';

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
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [placeOrder, { isLoading: isProcessing }] = useCheckoutOrderMutation();
  const [error, setError] = useState('');
  const submittingRef = useRef(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.0825;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length || isProcessing || submittingRef.current) return;
    setError('');
    submittingRef.current = true;
    try {
      const result = await placeOrder({ customerName: `${firstName.trim()} ${lastName.trim()}`.trim(), email: email.trim(), phone: phone.trim(), address: address.trim(), city: city.trim(), postalCode: zip.trim(), items: cart.map((item) => ({ productId: Number(item.product.id), quantity: item.quantity })) }).unwrap();
      setOrderNumber(result.orderNumber);
      setStep('confirmation');
      onClearCart();
      onSuccessToast?.(`Order #${result.orderNumber} placed. Thank you.`);
    } catch (failure) { setError(catalogError(failure)); }
    finally { submittingRef.current = false; }
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
                {step === 'confirmation' ? 'Order Received' : 'Insured Express Checkout'}
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
                  ORDER RECEIVED
                </span>
                <h3 className="text-2xl font-light text-white mt-1">
                  Order Placed
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Order reference number: <strong className="text-[#D4AF37] font-mono">{orderNumber}</strong>
                </p>
                <p className="text-xs text-neutral-400 mt-2">
                  Your order is pending review. Please keep this reference for any questions.
                </p>
              </div>

              <div className="p-4 bg-[#151515] rounded-xs border border-white/5 text-xs text-neutral-400 max-w-md mx-auto text-left space-y-1.5">
                <p className="font-semibold text-white flex items-center">
                  <Truck className="w-4 h-4 text-[#D4AF37] mr-1.5" />
                  Delivery details will be confirmed after review.
                </p>
                <p className="text-[11px] font-light">
                  No payment has been collected online.
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
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Email for order updates *</label>
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
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Phone number *</label>
                  <input type="tel" required maxLength={25} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Your contact number" className="w-full bg-[#151515] border border-white/10 rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]" />
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

              {/* Payment information */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h4 className="text-xs font-semibold uppercase text-white tracking-wider flex items-center">
                  <CreditCard className="w-4 h-4 text-[#D4AF37] mr-1.5" />
                  2. Payment Method
                </h4>

                <div className="bg-[#151515] p-3 rounded-xs border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Payment arranged after order review</span>
                    <span className="text-[10px] text-[#D4AF37] font-mono font-bold bg-black px-2 py-0.5 rounded-xs border border-[#D4AF37]/30">
                      No online charge
                    </span>
                  </div>
                  <p className="text-neutral-400">Staff will confirm your order and payment options using your email.</p>
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

              {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#D4AF37] hover:bg-[#C19A2F] disabled:bg-neutral-800 text-black font-semibold text-xs tracking-wider uppercase py-3.5 rounded-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Placing order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-black" />
                    <span>PLACE ORDER · ${total.toFixed(2)}</span>
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
