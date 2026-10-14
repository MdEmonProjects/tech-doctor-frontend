import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { CartItem, Product, ToastMessage } from '../types';
import { getNavigationPath } from '../navigation';
import { isOverlayPath } from '../routes/routeUtils';
import type { OverlayLocationState } from '../routes/routeUtils';

interface AppContextValue {
  cart: CartItem[];
  wishlist: Product[];
  toasts: ToastMessage[];
  notify: (title: string, description: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  navigateTo: (view: string, category?: string) => void;
  openOverlay: (path: string) => void;
  closeOverlay: () => void;
  bookRepair: (serviceTitle: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = (location.state as OverlayLocationState | null)?.backgroundLocation;
  const openOverlay = (path: string) => {
    navigate(path, { state: { backgroundLocation: isOverlayPath(location.pathname) ? backgroundLocation : location } });
  };
  const closeOverlay = () => {
    if (backgroundLocation) navigate(-1);
    else navigate('/', { replace: true });
  };

  // Cart & Wishlist State with local storage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('techdoctor_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('techdoctor_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist Cart & Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('techdoctor_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('techdoctor_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Toast Trigger Helper
  const notify = (title: string, description: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (view: string, category?: string) => {
    navigate(getNavigationPath(view, category));
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1, color?: string) => {
    if (!product.inStock) { notify('Product unavailable', 'This product is currently unavailable for purchase.', 'warning'); return; }
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color }];
    });
    notify('Added to Cart', `${quantity}x ${product.name} added to your cart`, 'success');
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    notify('Item Removed', 'Product removed from your cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Management
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    setWishlist((prev) => {
      return prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product];
    });
    notify(
      exists ? 'Removed from Wishlist' : 'Saved to Wishlist',
      `${product.name} ${exists ? 'removed' : 'saved'}`,
      exists ? 'info' : 'success',
    );
  };

  // Repair Booking Triggers
  const bookRepair = (serviceTitle: string) => {
    openOverlay(`/repairs/book?service=${encodeURIComponent(serviceTitle)}`);
  };


  return (
    <AppContext.Provider value={{
      cart, wishlist, toasts, notify, dismissToast,
      addToCart, updateCartQuantity, removeFromCart, clearCart, toggleWishlist,
      navigateTo, openOverlay, closeOverlay, bookRepair,
    }}>
      {children}
    </AppContext.Provider>
  );
}
