import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export default function CatalogDialog({ title, onClose, children, active = true }: { title: string; onClose: () => void; children: ReactNode; active?: boolean }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    const firstField = dialogRef.current?.querySelector<HTMLElement>('input, textarea, select')
      ?? dialogRef.current?.querySelector<HTMLElement>('button');
    firstField?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled)')];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previous?.focus(); };
  }, [active]);
  return <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div ref={dialogRef} role="dialog" aria-modal={active} aria-hidden={!active} aria-label={title} className="max-h-[95dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-h-[85dvh] sm:rounded-2xl sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-semibold text-foreground">{title}</h2><button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-muted hover:bg-slate-100"><X size={20} /></button></div>
      {children}
    </div>
  </div>;
}
