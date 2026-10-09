import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppProvider';

export function OverlayLayout() {
  const { closeOverlay } = useApp();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeOverlay();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOverlay]);

  return (
    <div className="text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#D4AF37] selection:text-black">
      <Outlet />
    </div>
  );
}
