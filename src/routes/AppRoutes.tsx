import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import RepairBrandsServices from '../pages/Admin/RepairBrandsServices';
import RepairBrandModels from '../pages/Admin/RepairBrandModels';
import Login from '../pages/Login';
import { useMeQuery } from '../features/auth/authQuerySlice';
import { logout, syncUser } from '../features/auth/authSlice';
import type { RootState } from '../app/store';
import PermissionRoute from './PermissionRoute';
import Users from '../pages/Admin/Users';
import Roles from '../pages/Admin/Roles';
import Permissions from '../pages/Admin/Permissions';
import { accessApi } from '../features/access/accessApi';
import type { AppDispatch } from '../app/store';
import Branches from '../pages/Admin/Branches';
import RepairTracking from '../pages/Admin/RepairTracking';
import RepairDetails from '../pages/Admin/RepairDetails';
import ProductCategories from '../pages/Admin/ProductCategories';
import Products from '../pages/Admin/Products';
import ProductEditor from '../pages/Admin/ProductEditor';
import ProductDetails from '../pages/Admin/ProductDetails';
import Orders from '../pages/Admin/Orders';
import OrderEditor from '../pages/Admin/OrderEditor';
import OrderDetails from '../pages/Admin/OrderDetails';

export function AppRoutes() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const sessionAccess = useRef<string | null>(null);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { data: sessionUser, isLoading: isSessionLoading, error: sessionError } = useMeQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const isSessionInvalid = Boolean(sessionError && 'status' in sessionError && sessionError.status === 401);
  const isOverlay = isOverlayPath(location.pathname);
  const background = (location.state as OverlayLocationState | null)?.backgroundLocation;
  const pageLocation = isOverlay ? background ?? { pathname: '/', search: '', hash: '' } : location;

  useEffect(() => {
    if (!isOverlay) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, isOverlay]);

  useEffect(() => {
    if (sessionUser) {
      const signature = JSON.stringify([sessionUser.roleId, sessionUser.permissions]);
      if (sessionAccess.current !== signature) {
        sessionAccess.current = signature;
        dispatch(accessApi.util.invalidateTags(['Access']));
      }
      dispatch(syncUser(sessionUser));
    }
    if (isSessionInvalid) dispatch(logout());
  }, [dispatch, isSessionInvalid, sessionUser]);

  const hasValidSession = isAuthenticated && !isSessionInvalid;

  return (
    <>
      <Routes location={pageLocation}>
        <Route path="login" element={<Login />} />
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
            <ProtectedRoute
              isAuthenticated={hasValidSession}
              isLoading={isAuthenticated && isSessionLoading}
              userRole={user?.role}
            >
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route element={<PermissionRoute permission="catalog.view" />}>
            <Route path="repair-service/brands-services" element={<RepairBrandsServices />} />
            <Route path="repair-service/brands-services/:brandId" element={<RepairBrandModels />} />
          </Route>
          <Route element={<PermissionRoute permission="product_categories.view" />}>
            <Route path="products-devices/categories" element={<ProductCategories />} />
          </Route>
          <Route element={<PermissionRoute permission="products.view" />}>
            <Route path="products-devices/products" element={<Products />} />
            <Route path="products-devices/products/:productId" element={<ProductDetails />} />
            <Route element={<PermissionRoute permission="products.create" />}>
              <Route path="products-devices/products/new" element={<ProductEditor />} />
            </Route>
            <Route element={<PermissionRoute permission="products.update" />}>
              <Route path="products-devices/products/:productId/edit" element={<ProductEditor />} />
            </Route>
          </Route>
          <Route element={<PermissionRoute permission="orders.view" />}>
            <Route path="products-devices/orders" element={<Orders />} />
            <Route path="products-devices/orders/:orderId" element={<OrderDetails />} />
            <Route element={<PermissionRoute permission="orders.create" />}><Route path="products-devices/orders/new" element={<OrderEditor />} /></Route>
            <Route element={<PermissionRoute permission="orders.update" />}><Route path="products-devices/orders/:orderId/edit" element={<OrderEditor />} /></Route>
          </Route>
          <Route element={<PermissionRoute permission="repairs.view" />}>
            <Route path="repair-service/repair-tracking" element={<RepairTracking />} />
            <Route path="repair-service/repair-tracking/:repairId" element={<RepairDetails />} />
          </Route>
          <Route element={<PermissionRoute permission="users.view" />}><Route path="users/accounts" element={<Users />} /></Route>
          <Route element={<PermissionRoute permission="roles.view" />}><Route path="users/roles" element={<Roles />} /></Route>
          <Route element={<PermissionRoute permission="permissions.view" />}><Route path="users/permissions" element={<Permissions />} /></Route>
          <Route element={<PermissionRoute permission="branches.view" />}><Route path="branches" element={<Branches />} /></Route>
        </Route>
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute
              isAuthenticated={hasValidSession}
              isLoading={isAuthenticated && isSessionLoading}
              userRole={user?.role}
              allowedRoles={['ADMIN']}
            >
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
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
