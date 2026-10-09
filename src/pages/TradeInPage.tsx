import { useApp } from '../context/AppProvider';
import React, { useState } from 'react';
import { TRADE_IN_DEVICES } from '../data/mockData';
import { TradeInDeviceOption } from '../types';
import { 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  RefreshCw, 
  Zap,
  Info,
  Gift,
  Lock
} from 'lucide-react';

export const TradeInPage = () => {
  const { navigateTo, notify } = useApp();
  const onShopWithCredit = () => navigateTo('shop');
  const onSuccessToast = (msg: string) => notify('Trade-In Appraisal', msg);
  const [selectedBrand, setSelectedBrand] = useState<'Apple' | 'Samsung' | 'Google'>('Apple');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(TRADE_IN_DEVICES[0].id);
  const [selectedStorage, setSelectedStorage] = useState<string>('256GB');
  const [deviceCondition, setDeviceCondition] = useState<'flawless' | 'good' | 'cracked' | 'faulty'>('flawless');
  const [isLockedIn, setIsLockedIn] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [payoutChoice, setPayoutChoice] = useState<'cash' | 'credit'>('credit');

  const filteredDevices = TRADE_IN_DEVICES.filter((d) => d.brand === selectedBrand);
  const currentDevice = TRADE_IN_DEVICES.find((d) => d.id === selectedDeviceId) || TRADE_IN_DEVICES[0];

  // Base value calculation
  const storageOption = currentDevice.storages.find((s) => s.size === selectedStorage) || currentDevice.storages[0];
  const baseValue = storageOption.baseValue;

  const conditionMultipliers = {
    flawless: 1.0,
    good: 0.85,
    cracked: 0.55,
    faulty: 0.30
  };

  const calculatedCash = Math.round(baseValue * conditionMultipliers[deviceCondition]);
  const calculatedCredit = Math.round(calculatedCash * 1.15); // 15% extra store credit

  const handleLockIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;
    setIsLockedIn(true);
    onSuccessToast(`Trade-in offer for ${currentDevice.name} locked in! Prepaid label generated.`);
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white py-12 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
            <DollarSign className="w-3.5 h-3.5" />
            <span>INSTANT LIQUIDITY &bull; TRADE-IN ATELIER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Device Buyback &amp; <span className="font-serif italic font-normal text-[#D4AF37]">Trade-In Valuation</span>
          </h1>
          <p className="text-xs sm:text-base text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Turn your current smartphone into instant bank payout or receive a <strong>+15% bonus</strong> towards a new flagship or cleanroom repair. Guaranteed 14-day price lock.
          </p>
        </div>

        {/* Interactive Estimator Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Device Configurator */}
          <div className="lg:col-span-7 bg-[#111111] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="border-b border-white/5 pb-4">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#D4AF37]">
                STEP 1: SELECT HARDWARE SPECIFICATIONS
              </span>
              <h3 className="text-xl font-light text-white mt-1">Configure Your Device</h3>
            </div>

            {/* Brand Tabs */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                Manufacturer
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Apple', 'Samsung', 'Google'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBrand(b);
                      const first = TRADE_IN_DEVICES.find((d) => d.brand === b);
                      if (first) {
                        setSelectedDeviceId(first.id);
                        setSelectedStorage(first.storages[0].size);
                      }
                    }}
                    className={`py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      selectedBrand === b
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-[#161616] text-neutral-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selector */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                Model Series
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredDevices.map((dev) => (
                  <button
                    key={dev.id}
                    onClick={() => {
                      setSelectedDeviceId(dev.id);
                      setSelectedStorage(dev.storages[0].size);
                    }}
                    className={`p-3 rounded-sm text-left text-xs transition-all border flex items-center space-x-3 cursor-pointer ${
                      selectedDeviceId === dev.id
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white'
                        : 'bg-[#161616] border-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className={`w-4 h-4 shrink-0 ${selectedDeviceId === dev.id ? 'text-[#D4AF37]' : 'text-neutral-500'}`} />
                    <span className="font-medium line-clamp-1">{dev.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Capacity */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                Internal Storage
              </label>
              <div className="flex flex-wrap gap-2">
                {currentDevice.storages.map((st) => (
                  <button
                    key={st.size}
                    onClick={() => setSelectedStorage(st.size)}
                    className={`px-4 py-2 rounded-sm text-xs font-mono transition-all cursor-pointer ${
                      selectedStorage === st.size
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-[#161616] text-neutral-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {st.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Evaluation */}
            <div className="pt-2">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                Physical &amp; Operational Condition
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'flawless',
                    title: 'Flawless / Mint',
                    desc: 'No scratches, 100% functional, all sensors active.'
                  },
                  {
                    id: 'good',
                    title: 'Good / Minor Wear',
                    desc: 'Light body micro-scuffs, no screen cracks, healthy battery.'
                  },
                  {
                    id: 'cracked',
                    title: 'Cracked Glass / Scuffs',
                    desc: 'Front or back glass cracked, but display/touch still functions.'
                  },
                  {
                    id: 'faulty',
                    title: 'Logic / Power Fault',
                    desc: 'Dead pixels, water damage, or device fails to boot.'
                  }
                ].map((cond) => (
                  <button
                    key={cond.id}
                    onClick={() => setDeviceCondition(cond.id as any)}
                    className={`p-3.5 rounded-sm text-left transition-all border cursor-pointer ${
                      deviceCondition === cond.id
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]'
                        : 'bg-[#161616] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${deviceCondition === cond.id ? 'text-[#D4AF37]' : 'text-white'}`}>
                        {cond.title}
                      </span>
                      {deviceCondition === cond.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </div>
                    <p className="text-[11px] text-neutral-400 font-light mt-1 leading-relaxed">
                      {cond.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Valuation & Instant Lock-in Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="bg-[#111111] border border-white/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#D4AF37]">
                  REAL-TIME APPRAISAL
                </span>
                <h3 className="text-lg font-light text-white mt-1">Guaranteed Valuation</h3>
              </div>

              {/* Dual Valuation Cards (Cash vs Store Credit) */}
              <div className="space-y-3">
                {/* Store Credit Option (Highlit) */}
                <div
                  onClick={() => setPayoutChoice('credit')}
                  className={`p-4 rounded-sm border cursor-pointer transition-all ${
                    payoutChoice === 'credit'
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg'
                      : 'bg-[#161616] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Tech Doctor Atelier Credit
                      </span>
                    </div>
                    <span className="bg-[#D4AF37] text-black text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full">
                      +15% BONUS
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-light text-[#D4AF37]">${calculatedCredit}</span>
                    <span className="text-xs text-neutral-400">for upgrades or repairs</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1 font-light">
                    Can be applied instantly towards new iPhones, Samsung flagships, or screen repairs.
                  </p>
                </div>

                {/* Direct Cash Transfer */}
                <div
                  onClick={() => setPayoutChoice('cash')}
                  className={`p-4 rounded-sm border cursor-pointer transition-all ${
                    payoutChoice === 'cash'
                      ? 'bg-white/10 border-white text-white'
                      : 'bg-[#161616] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">
                        Direct Cash Transfer
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">Same-Day ACH / PayPal</span>
                  </div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-light text-white">${calculatedCash}</span>
                    <span className="text-xs text-neutral-400">payout via bank or card</span>
                  </div>
                </div>
              </div>

              {/* Lock-In Form */}
              {!isLockedIn ? (
                <form onSubmit={handleLockIn} className="space-y-3 pt-2 border-t border-white/5">
                  <div className="text-xs font-semibold text-white">Lock In This 14-Day Price Guarantee</div>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Your Full Name..."
                    className="w-full bg-[#0c0c0c] border border-white/10 focus:border-[#D4AF37] text-white p-2.5 rounded-sm text-xs focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Email address for shipping kit &amp; voucher..."
                    className="w-full bg-[#0c0c0c] border border-white/10 focus:border-[#D4AF37] text-white p-2.5 rounded-sm text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase py-3 rounded-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock In ${payoutChoice === 'credit' ? calculatedCredit : calculatedCash} Offer</span>
                  </button>
                  <p className="text-[10px] text-neutral-500 text-center font-light">
                    No obligation to sell. Includes free insured prepaid shipping kit.
                  </p>
                </form>
              ) : (
                <div className="bg-[#141414] border border-emerald-500/30 p-5 rounded-sm space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>VOUCHER &amp; SHIPPING LABEL GENERATED</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    Thank you <strong>{clientName}</strong>! Your 14-day lock voucher of <strong>${payoutChoice === 'credit' ? calculatedCredit : calculatedCash}</strong> for your {currentDevice.name} ({selectedStorage}) has been issued to {clientEmail}.
                  </p>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={onShopWithCredit}
                      className="bg-[#D4AF37] text-black text-xs font-semibold py-2 rounded-sm uppercase tracking-wider cursor-pointer"
                    >
                      Browse New Smartphones
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* 3 Step Process Note */}
            <div className="bg-[#111111] border border-white/10 p-5 rounded-sm space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <Sparkles className="w-4 h-4" />
                <span className="font-mono font-semibold uppercase tracking-wider text-[10px]">
                  How Trade-In Works
                </span>
              </div>
              <ul className="space-y-2 text-neutral-400 font-light text-[11px]">
                <li className="flex items-start space-x-2">
                  <span className="font-mono font-bold text-white">1.</span>
                  <span><strong>Get Instant Quote:</strong> Lock in guaranteed value online in 60 seconds.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono font-bold text-white">2.</span>
                  <span><strong>Drop off or Mail In:</strong> Use our free insured box kit or visit our lounge.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono font-bold text-white">3.</span>
                  <span><strong>24-Hour Payout:</strong> Inspected by cleanroom techs and paid within 24 hours.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
