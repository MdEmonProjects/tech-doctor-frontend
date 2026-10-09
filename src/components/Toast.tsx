import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#141414] text-white p-4 rounded-sm shadow-2xl border border-[#D4AF37]/50 flex items-start space-x-3 text-xs animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          ) : toast.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white tracking-wide">{toast.title}</h4>
            <p className="text-neutral-400 mt-0.5 text-[11px] font-light leading-relaxed">
              {toast.description}
            </p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-neutral-400 hover:text-white p-1 rounded-xs cursor-pointer shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const Toast = ToastContainer;
