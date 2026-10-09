import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { OverlayLayout } from '../layouts/OverlayLayout';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { RepairsPage } from '../pages/RepairsPage';
import { RepairTrackingPage } from '../pages/RepairTrackingPage';
import { TradeInPage } from '../pages/TradeInPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { FAQPage } from '../pages/FAQPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { CartPage } from '../pages/CartPage';
import { WishlistPage } from '../pages/WishlistPage';
import { SearchPage } from '../pages/SearchPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ProductPage } from '../pages/ProductPage';
import { RepairBookingPage } from '../pages/RepairBookingPage';
import { isOverlayPath } from './routeUtils';
import type { OverlayLocationState } from './routeUtils';
import { ProtectedRoute } from './ProtectedRoute';
import DashboardLayout from '../components/DashboardLayout';
import Dashboard from '../pages/Admin/Dashboard';

export function AppRoutes() {
  const location = useLocation();
  const isOverlay = isOverlayPath(location.pathname);
  const background = (location.state as OverlayLocationState | null)?.backgroundLocation;
  const pageLocation = isOverlay ? background ?? { pathname: '/', search: '', hash: '' } : location;

  useEffect(() => {
    if (!isOverlay) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, isOverlay]);

  return (
    <>
      <Routes location={pageLocation}>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="repairs" element={<RepairsPage />} />
          <Route path="tracking" element={<RepairTrackingPage />} />
          <Route path="trade-in" element={<TradeInPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route
          path="dashboard"
          element={
            // Replace this with your authentication provider's session state.
            <ProtectedRoute isAuthenticated={false} redirectTo="/">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<NotFoundPage />} />
        </Route>
      </Routes>
      {isOverlay && (
        <Routes>
          <Route element={<OverlayLayout />}>
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="products/:productId" element={<ProductPage />} />
            <Route path="repairs/book" element={<RepairBookingPage />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
