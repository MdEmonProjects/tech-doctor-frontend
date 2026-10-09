import { useApp } from '../context/AppProvider';
import React, { useState } from 'react';
import { REPAIR_SERVICES, POPULAR_DEVICES } from '../data/mockData';
import { RepairBookingSection } from '../components/RepairBookingSection';
import { 
  Wrench, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Cpu, 
  Layers, 
  Flame, 
  Truck, 
  ArrowRight,
  Info,
  Check,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const RepairsPage = () => {
  const { bookRepair: onSelectServiceForBooking, openOverlay, navigateTo, notify } = useApp();
  const onBookAppointment = () => openOverlay('/repairs/book');
  const onNavigateToTracking = () => navigateTo('tracking');
  const onSuccessToast = (msg: string) => notify('Repair Ingestion', msg);
  const [activeTab, setActiveTab] = useState<'catalog' | 'comparison' | 'process'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedService, setExpandedService] = useState<string | null>(null);

  // Diagnostic Wizard State
  const [wizardBrand, setWizardBrand] = useState('Apple');
  const [wizardModel, setWizardModel] = useState('iPhone 15 Pro Max');
  const [wizardIssue, setWizardIssue] = useState('Cracked Front Glass / OLED Issue');

  const filteredServices = selectedCategory === 'all' 
    ? REPAIR_SERVICES 
    : REPAIR_SERVICES.filter(s => s.supportedBrands.some(b => b.toLowerCase().includes(selectedCategory.toLowerCase())));

  const handleStartWizardBooking = () => {
    onSelectServiceForBooking(wizardIssue);
    const el = document.getElementById('repairs-booking-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onBookAppointment();
    }
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white py-10">
      
      {/* 1. Atelier Header & Breadcrumb Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLEANROOM BENCH &bull; ISO 9001 CERTIFIED</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Certified Smartphone <span className="font-serif italic font-normal text-[#D4AF37]">Repair Atelier</span>
          </h1>
          <p className="text-xs sm:text-base text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Surgical-grade mobile device restoration using original OEM specification components, automated water seal repressurization, and lifetime hardware warranties.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('repairs-booking-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onBookAppointment();
              }}
              className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-sm shadow-xl transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>Instant Quote &amp; Booking</span>
            </button>
            <button
              onClick={onNavigateToTracking}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#D4AF37] text-xs tracking-wider uppercase px-6 py-3 rounded-sm transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Track Existing Repair Status</span>
            </button>
          </div>
        </div>

        {/* 2. Interactive Diagnostic & Instant Turnaround Quick Wizard */}
        <div className="bg-[#111111] border border-white/10 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-2">
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                INSTANT DIAGNOSTIC WIZARD
              </span>
              <h2 className="text-lg sm:text-xl font-light text-white">
                Find Your Device &amp; Estimate Restoration Time
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cleanroom Bench Queue: <strong>Normal (25 min avg)</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1.5">
                1. Select Brand
              </label>
              <select
                value={wizardBrand}
                onChange={(e) => {
                  setWizardBrand(e.target.value);
                  const firstDev = POPULAR_DEVICES.find((device) => device.brand === e.target.value)?.models[0] ?? '';
                  setWizardModel(firstDev);
                }}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Apple">Apple iPhone</option>
                <option value="Samsung">Samsung Galaxy</option>
                <option value="Google">Google Pixel</option>
                <option value="OnePlus">OnePlus Series</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1.5">
                2. Select Model
              </label>
              <select
                value={wizardModel}
                onChange={(e) => setWizardModel(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {(POPULAR_DEVICES.find((p) => p.brand === wizardBrand)?.models || []).map((dev) => (
                  <option key={dev} value={dev}>{dev}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1.5">
                3. Select Symptom / Fault
              </label>
              <select
                value={wizardIssue}
                onChange={(e) => setWizardIssue(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Screen & OLED Replacement">Cracked Screen / OLED Lines / Touch Deadzone</option>
                <option value="Battery Health Swap">Degraded Battery / Quick Drain / Random Shutdowns</option>
                <option value="Charging Port & USB-C">Loose USB-C / Lightning Port / Won't Fast Charge</option>
                <option value="Camera Lens & Sensor">Blurry 50MP Lens / Cracked Glass Visor / OIS Shake</option>
                <option value="Back Glass Laser Removal">Shattered Rear Glass / MagSafe Enclosure</option>
                <option value="Water Damage Recovery">Dropped in Water / Liquid Ingress Diagnostic</option>
              </select>
            </div>
          </div>

          <div className="bg-[#161616] border border-white/5 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="text-white font-medium">
                {wizardBrand} {wizardModel} &bull; <span className="text-[#D4AF37]">{wizardIssue}</span>
              </div>
              <div className="text-neutral-400 text-[11px] font-light flex items-center space-x-3">
                <span>Estimated Bench Time: <strong>20 - 45 Mins</strong></span>
                <span>&bull;</span>
                <span>Includes: <strong>TrueTone / Calibration + Lifetime Warranty</strong></span>
              </div>
            </div>

            <button
              onClick={handleStartWizardBooking}
              className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <span>Lock In Quote &amp; Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Navigation View Tabs: Catalog / Cleanroom Comparison / Walk-in Process */}
        <div className="border-b border-white/10 flex items-center space-x-8">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-4 text-xs uppercase font-mono tracking-widest cursor-pointer transition-all border-b-2 ${
              activeTab === 'catalog'
                ? 'border-[#D4AF37] text-[#D4AF37] font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            All Repair Disciplines
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`pb-4 text-xs uppercase font-mono tracking-widest cursor-pointer transition-all border-b-2 ${
              activeTab === 'comparison'
                ? 'border-[#D4AF37] text-[#D4AF37] font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Tech Doctor vs Generic Kiosks
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`pb-4 text-xs uppercase font-mono tracking-widest cursor-pointer transition-all border-b-2 ${
              activeTab === 'process'
                ? 'border-[#D4AF37] text-[#D4AF37] font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            5-Stage Precision Protocol
          </button>
        </div>

        {/* Tab 1: Comprehensive Repair Services Catalog */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {['all', 'apple', 'samsung', 'google', 'oneplus'].map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedCategory(brand)}
                    className={`px-4 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === brand
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-[#111111] text-neutral-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {brand === 'all' ? 'All Devices' : brand}
                  </button>
                ))}
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                Showing {filteredServices.length} specialized procedures
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((srv) => {
                const isExpanded = expandedService === srv.id;
                return (
                  <div
                    key={srv.id}
                    className="bg-[#111111] border border-white/10 rounded-sm p-6 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-sm bg-white/5 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform">
                          <Wrench className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-xs bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                          {srv.warranty}
                        </span>
                      </div>

                      <h3 className="text-base font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                        {srv.title}
                      </h3>

                      <p className="text-xs text-neutral-400 font-light leading-relaxed">
                        {srv.shortDesc}
                      </p>

                      {isExpanded && (
                        <div className="pt-3 border-t border-white/5 space-y-2 text-xs text-neutral-300 animate-in fade-in duration-200">
                          <p className="font-light">{srv.fullDesc}</p>
                          <div className="pt-2">
                            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block mb-1">
                              Common Symptoms Treated:
                            </span>
                            <ul className="space-y-1">
                              {srv.popularIssues.map((issue, idx) => (
                                <li key={idx} className="flex items-center space-x-1.5 text-neutral-400 text-[11px]">
                                  <CheckCircle className="w-3 h-3 text-[#D4AF37] shrink-0" />
                                  <span>{issue}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-500 font-mono block">STARTING FROM</span>
                        <span className="text-lg font-light text-white">${srv.startingPrice}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setExpandedService(isExpanded ? null : srv.id)}
                          className="text-[11px] text-neutral-400 hover:text-white px-2 py-1 cursor-pointer"
                        >
                          {isExpanded ? 'Less' : 'Details'}
                        </button>
                        <button
                          onClick={() => {
                            onSelectServiceForBooking(srv.title);
                            const el = document.getElementById('repairs-booking-anchor');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            else onBookAppointment();
                          }}
                          className="bg-white/5 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-semibold px-3 py-1.5 rounded-sm border border-white/10 hover:border-transparent transition-all cursor-pointer"
                        >
                          Book Service
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Cleanroom vs Generic Comparison */}
        {activeTab === 'comparison' && (
          <div className="bg-[#111111] border border-white/10 rounded-sm p-6 sm:p-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl font-light text-white">
                Why Genuine Atelier Craftsmanship Matters
              </h3>
              <p className="text-xs text-neutral-400 font-light">
                Cheap kiosk repairs often result in dead touch responsiveness, disabled FaceID/TrueTone, and swollen low-grade batteries. Here is our direct standard comparison.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider">
                    <th className="py-4 px-4">Standard &amp; Protocol</th>
                    <th className="py-4 px-4 bg-[#D4AF37]/5 border-l border-r border-[#D4AF37]/20">Tech Doctor Cleanroom</th>
                    <th className="py-4 px-4 text-neutral-400">Typical Mall Kiosk / Budget Shop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Display Panel Grade</td>
                    <td className="py-3.5 px-4 bg-[#D4AF37]/5 border-l border-r border-[#D4AF37]/20 text-[#D4AF37] font-semibold flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>OEM-Grade Super Retina / Dynamic AMOLED (120Hz)</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Low-refresh TFT / Generic LCD knockoff</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">TrueTone &amp; Biometrics Calibration</td>
                    <td className="py-3.5 px-4 bg-[#D4AF37]/5 border-l border-r border-[#D4AF37]/20 text-[#D4AF37] font-semibold flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>100% Preserved via EEPROM serialization programmer</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Disabled; iOS &quot;Unknown Part&quot; warning triggered</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Water &amp; Dust Seal Repressurization</td>
                    <td className="py-3.5 px-4 bg-[#D4AF37]/5 border-l border-r border-[#D4AF37]/20 text-[#D4AF37] font-semibold flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Automated pneumatic chamber (IP68 verified)</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>No gasket replaced; zero water protection</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Warranty Coverage</td>
                    <td className="py-3.5 px-4 bg-[#D4AF37]/5 border-l border-r border-[#D4AF37]/20 text-[#D4AF37] font-semibold flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Lifetime Warranty on Screen Defects</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>14 to 30 days max (often disputed)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Data Privacy Guarantee</td>
                    <td className="py-3.5 px-4 bg-[#D4AF37]/5 border-l border-r border-[#D4AF37]/20 text-[#D4AF37] font-semibold flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Zero Passcode requirement &bull; Complete privacy seal</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Demands passcode; unmonitored device access</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: 5-Stage Precision Protocol */}
        {activeTab === 'process' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Intake & UV Sanitization',
                desc: 'Serial verification, physical diagnostic sweep, and medical-grade UV germicidal sterilization.'
              },
              {
                step: '02',
                title: 'Microscopic Board Diagnostics',
                desc: 'Logic board thermal camera inspection and multimeter voltage validation before opening.'
              },
              {
                step: '03',
                title: 'Cleanroom Bench Assembly',
                desc: 'ESD grounded installation of serialized OEM-spec displays, batteries, or micro-soldered components.'
              },
              {
                step: '04',
                title: 'Pneumatic IP68 Pressure Seal',
                desc: 'Device is vacuum-sealed using specialized heating fixtures to restore factory water resistance.'
              },
              {
                step: '05',
                title: '24-Point QC & Lifetime Certificate',
                desc: 'Hardware sweep across display, microphones, cameras, charging speed, and NFC before handoff.'
              }
            ].map((p) => (
              <div key={p.step} className="bg-[#111111] border border-white/10 p-5 rounded-sm space-y-3">
                <div className="text-xl font-mono font-bold text-[#D4AF37]">{p.step}</div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">{p.title}</h4>
                <p className="text-[11px] text-neutral-400 font-light leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* 4. Embedded Full Interactive Repair Booking Engine */}
        <div id="repairs-booking-anchor" className="pt-8">
          <RepairBookingSection
            initialService={wizardIssue}
            onSuccessToast={onSuccessToast}
          />
        </div>

      </div>
    </div>
  );
};
