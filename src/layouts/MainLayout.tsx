import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ToastContainer } from '../components/Toast';
import { useApp } from '../context/AppProvider';
import { PAGE_PATHS } from '../navigation';

export function MainLayout() {
  const { pathname } = useLocation();
  const { cart, wishlist, toasts, dismissToast, openOverlay } = useApp();
  const currentView = Object.entries(PAGE_PATHS).find(([, path]) => path === pathname)?.[0] ?? '';
  const bookRepair = () => openOverlay('/repairs/book');

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#D4AF37] selection:text-black">
      <AnnouncementBar onBookRepairClick={bookRepair} />
      <Header
        currentView={currentView}
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => openOverlay('/cart')}
        onOpenWishlist={() => openOverlay('/wishlist')}
        onOpenSearch={() => openOverlay('/search')}
        onBookRepair={bookRepair}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer onBookRepair={bookRepair} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
