import { useApp } from '../context/AppProvider';
import React, { useState } from 'react';
import { MOCK_TRACKING_TICKETS } from '../data/mockData';
import { RepairTrackingTicket } from '../types';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Wrench, 
  Printer, 
  MessageSquare, 
  User, 
  Smartphone, 
  ArrowRight,
  Sparkles,
  FileText,
  X,
  Send
} from 'lucide-react';

export const RepairTrackingPage = () => {
  const { openOverlay, notify } = useApp();
  const onBookNewRepair = () => openOverlay('/repairs/book');
  const onSuccessToast = (msg: string) => notify('Cleanroom Telemetry', msg, 'info');
  const [searchQuery, setSearchQuery] = useState('TD-84920');
  const [currentTicket, setCurrentTicket] = useState<RepairTrackingTicket | null>(
    MOCK_TRACKING_TICKETS[0]
  );
  const [hasSearched, setHasSearched] = useState(true);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isTechMessageOpen, setIsTechMessageOpen] = useState(false);
  const [techMessageText, setTechMessageText] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    const found = MOCK_TRACKING_TICKETS.find(
      (t) => t.ticketId.toUpperCase() === query || t.customerName.toUpperCase().includes(query)
    );
    if (found) {
      setCurrentTicket(found);
      setHasSearched(true);
      onSuccessToast(`Loaded live diagnostics for ticket ${found.ticketId}`);
    } else {
      setCurrentTicket(null);
      setHasSearched(true);
    }
  };

  const handleSelectSample = (ticketId: string) => {
    setSearchQuery(ticketId);
    const found = MOCK_TRACKING_TICKETS.find((t) => t.ticketId === ticketId);
    if (found) {
      setCurrentTicket(found);
      setHasSearched(true);
    }
  };

  const handleSendTechMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techMessageText.trim()) return;
    setIsTechMessageOpen(false);
    setTechMessageText('');
    onSuccessToast('Message dispatched directly to the cleanroom technician bench.');
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white py-12 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header & Search Bar */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-semibold uppercase tracking-[0.25em] font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>REAL-TIME CLEANROOM TELEMETRY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Repair Status &amp; <span className="font-serif italic font-normal text-[#D4AF37]">Diagnostic Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Track your device through every microscopic bench stage, review water seal sensor logs, and access your verified Lifetime Warranty certificate.
          </p>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="pt-2 flex items-center max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Ticket ID (e.g. TD-84920)..."
              className="w-full bg-[#111111] border border-white/15 focus:border-[#D4AF37] text-white px-4 py-3 pl-10 rounded-sm text-xs focus:outline-none transition-all placeholder:text-neutral-500 font-mono"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs px-4 rounded-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Track
            </button>
          </form>

          {/* Quick Demo Samples */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-neutral-400">
            <span className="font-mono text-neutral-500">Live Demo Tickets:</span>
            {MOCK_TRACKING_TICKETS.map((t) => (
              <button
                key={t.ticketId}
                onClick={() => handleSelectSample(t.ticketId)}
                className={`font-mono px-2.5 py-1 rounded-xs border transition-all cursor-pointer ${
                  currentTicket?.ticketId === t.ticketId
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-[#111111] border-white/10 text-neutral-300 hover:border-[#D4AF37]/50'
                }`}
              >
                {t.ticketId} ({t.device.split(' ')[1]})
              </button>
            ))}
          </div>
        </div>

        {/* Search Results / Ticket View */}
        {currentTicket ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Ticket Summary Header Card */}
            <div className="bg-[#111111] border border-white/10 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-white/5 pb-6 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-lg sm:text-xl font-bold text-[#D4AF37]">
                      {currentTicket.ticketId}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      currentTicket.statusBadge === 'Ready for Pickup'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : currentTicket.statusBadge === 'Quality Control'
                        ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 animate-pulse'
                        : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                    }`}>
                      &bull; {currentTicket.statusBadge}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-light text-white">
                    {currentTicket.device}
                  </h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Client: <strong className="text-white">{currentTicket.customerName}</strong> &bull; IMEI: <span className="font-mono">{currentTicket.imeiSnippet}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsCertificateOpen(true)}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#D4AF37] px-4 py-2.5 rounded-sm text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Warranty Certificate</span>
                  </button>
                  <button
                    onClick={() => setIsTechMessageOpen(true)}
                    className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Tech</span>
                  </button>
                </div>
              </div>

              {/* Fast Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-[#161616] p-3.5 rounded-sm border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Service Requested</span>
                  <div className="font-medium text-white line-clamp-1">{currentTicket.serviceRequested}</div>
                </div>
                <div className="bg-[#161616] p-3.5 rounded-sm border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Intake Timestamp</span>
                  <div className="font-medium text-white">{currentTicket.dateReceived}</div>
                </div>
                <div className="bg-[#161616] p-3.5 rounded-sm border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Estimated Completion</span>
                  <div className="font-medium text-[#D4AF37]">{currentTicket.estimatedCompletion}</div>
                </div>
                <div className="bg-[#161616] p-3.5 rounded-sm border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Bench Total</span>
                  <div className="font-medium text-white">${currentTicket.totalCost}.00 (Tax incl.)</div>
                </div>
              </div>
            </div>

            {/* 5-Step Visual Timeline Card */}
            <div className="bg-[#111111] border border-white/10 rounded-sm p-6 sm:p-8 shadow-xl space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#D4AF37] font-semibold uppercase tracking-widest">
                    BENCH PROGRESSION
                  </span>
                  <h3 className="text-lg font-light text-white">
                    Step {currentTicket.currentStep} of {currentTicket.totalSteps}: {currentTicket.statusTitle}
                  </h3>
                </div>
                <div className="text-xs text-neutral-400 font-mono">
                  {Math.round((currentTicket.currentStep / currentTicket.totalSteps) * 100)}% Complete
                </div>
              </div>

              {/* Step Flow List */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
                {currentTicket.steps.map((step, idx) => {
                  const isCompleted = step.status === 'completed';
                  const isInProgress = step.status === 'in-progress';

                  return (
                    <div key={idx} className="relative group">
                      {/* Status Dot */}
                      <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isCompleted
                          ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/30'
                          : isInProgress
                          ? 'bg-amber-400 text-black animate-pulse'
                          : 'bg-[#1a1a1a] text-neutral-500 border border-white/10'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="font-mono text-[10px]">{idx + 1}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className={`text-xs sm:text-sm font-medium ${
                            isCompleted ? 'text-white' : isInProgress ? 'text-[#D4AF37] font-semibold' : 'text-neutral-500'
                          }`}>
                            {step.name}
                          </h4>
                          {step.timestamp && (
                            <span className="text-[10px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded-xs">
                              {step.timestamp}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Diagnostics & Master Technician Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Cleanroom Diagnostic Report */}
              <div className="lg:col-span-2 bg-[#111111] border border-white/10 rounded-sm p-6 space-y-4">
                <div className="flex items-center space-x-2 text-[#D4AF37]">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-widest">
                    Digital Bench Inspection Logs
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  {currentTicket.diagnostics.batteryHealthOriginal && (
                    <div className="bg-[#161616] p-3 rounded-sm border border-white/5">
                      <span className="text-neutral-500 text-[10px] uppercase font-mono block">Original Battery State</span>
                      <span className="text-amber-400 font-mono font-medium">{currentTicket.diagnostics.batteryHealthOriginal}</span>
                    </div>
                  )}
                  {currentTicket.diagnostics.batteryHealthNew && (
                    <div className="bg-[#161616] p-3 rounded-sm border border-white/5">
                      <span className="text-neutral-500 text-[10px] uppercase font-mono block">New OEM Capacity</span>
                      <span className="text-emerald-400 font-mono font-medium">{currentTicket.diagnostics.batteryHealthNew}</span>
                    </div>
                  )}
                  <div className="bg-[#161616] p-3 rounded-sm border border-white/5">
                    <span className="text-neutral-500 text-[10px] uppercase font-mono block">TrueTone &amp; Biometrics</span>
                    <span className="text-emerald-400 font-mono font-medium">Serialized &amp; Active</span>
                  </div>
                  <div className="bg-[#161616] p-3 rounded-sm border border-white/5">
                    <span className="text-neutral-500 text-[10px] uppercase font-mono block">Waterproof Gasket</span>
                    <span className="text-[#D4AF37] font-mono font-medium">{currentTicket.diagnostics.waterProofSealPressure}</span>
                  </div>
                </div>

                <div className="bg-[#161616] p-4 rounded-sm border border-white/5 text-xs text-neutral-300 font-light space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Technician Bench Notes</span>
                  <p className="italic leading-relaxed">&ldquo;{currentTicket.diagnostics.technicianNotes}&rdquo;</p>
                </div>
              </div>

              {/* Master Tech Card */}
              <div className="bg-[#111111] border border-white/10 rounded-sm p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#D4AF37]">
                    ASSIGNED SPECIALIST
                  </span>

                  <div className="flex items-center space-x-3">
                    <img
                      src={currentTicket.technician.avatar}
                      alt={currentTicket.technician.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
                    />
                    <div>
                      <h5 className="text-sm font-semibold text-white">{currentTicket.technician.name}</h5>
                      <p className="text-xs text-[#D4AF37] font-light">{currentTicket.technician.role}</p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5">ISO 9001 Certified &bull; 8 Yrs Exp</p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Have specific questions about your repair or parts calibration? You can contact Marcus directly while your phone is on the cleanroom bench.
                  </p>
                </div>

                <button
                  onClick={() => setIsTechMessageOpen(true)}
                  className="w-full bg-white/5 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-semibold py-2.5 rounded-sm border border-white/10 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Direct Question</span>
                </button>
              </div>

            </div>

          </div>
        ) : hasSearched ? (
          <div className="text-center py-16 bg-[#111111] border border-white/10 rounded-sm p-8 space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-lg font-light text-white">No Ticket Found for &ldquo;{searchQuery}&rdquo;</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Please double check the ticket ID on your receipt (format: TD-XXXXX) or try searching with Alexander Hayes or one of our sample tickets above.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => handleSelectSample('TD-84920')}
                className="bg-[#D4AF37] text-black text-xs font-semibold px-4 py-2 rounded-sm cursor-pointer"
              >
                Load Sample TD-84920
              </button>
              <button
                onClick={onBookNewRepair}
                className="bg-white/5 text-white border border-white/10 text-xs px-4 py-2 rounded-sm cursor-pointer"
              >
                Book a New Repair
              </button>
            </div>
          </div>
        ) : null}

      </div>

      {/* Printable Certificate Modal */}
      {isCertificateOpen && currentTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#D4AF37]/50 rounded-sm max-w-lg w-full p-6 sm:p-8 space-y-6 text-white animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
                  Official Atelier Warranty Certificate
                </h3>
              </div>
              <button
                onClick={() => setIsCertificateOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-white/10 bg-[#0c0c0c] p-5 rounded-sm space-y-4 text-xs font-mono">
              <div className="text-center space-y-1 border-b border-white/10 pb-3">
                <div className="text-[#D4AF37] font-bold text-sm tracking-[0.2em]">TECH DOCTOR ATELIER</div>
                <div className="text-neutral-400 text-[10px]">ISO 9001:2015 CERTIFIED REPAIR FACILITY</div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Ticket ID:</span>
                  <span className="text-[#D4AF37] font-bold">{currentTicket.ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Client Name:</span>
                  <span>{currentTicket.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Device Hardware:</span>
                  <span>{currentTicket.device}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Service Rendered:</span>
                  <span>{currentTicket.serviceRequested}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Warranty Term:</span>
                  <span className="text-emerald-400 font-bold">{currentTicket.warrantyPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Certified Specialist:</span>
                  <span>{currentTicket.technician.name}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-[9px] text-neutral-500 leading-relaxed text-center">
                This serialized document certifies genuine OEM component calibration and zero data alteration. Retain digital copy for claim verification.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                  onSuccessToast('Warranty document sent to printer.');
                }}
                className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs px-5 py-2.5 rounded-sm uppercase tracking-wider cursor-pointer flex items-center space-x-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Technician Direct Message Modal */}
      {isTechMessageOpen && currentTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/15 rounded-sm max-w-md w-full p-6 space-y-4 text-white animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Message Technician ({currentTicket.technician.name})
                </h3>
              </div>
              <button
                onClick={() => setIsTechMessageOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendTechMessage} className="space-y-3 text-xs">
              <p className="text-neutral-400 font-light text-[11px]">
                Your inquiry will ping {currentTicket.technician.name}&apos;s cleanroom terminal regarding ticket <strong>{currentTicket.ticketId}</strong>.
              </p>
              <textarea
                value={techMessageText}
                onChange={(e) => setTechMessageText(e.target.value)}
                placeholder="Ask about your device turnaround, battery health question, or express courier pickup..."
                rows={4}
                required
                className="w-full bg-[#0c0c0c] border border-white/10 focus:border-[#D4AF37] text-white p-3 rounded-sm text-xs focus:outline-none placeholder:text-neutral-600"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTechMessageOpen(false)}
                  className="px-3 py-2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#C19A2F] text-black font-semibold text-xs px-4 py-2 rounded-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
