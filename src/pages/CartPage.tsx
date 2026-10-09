import { useApp } from '../context/AppProvider';
import { CartDrawer } from '../components/CartDrawer';

export function CartPage() {
  const { cart, closeOverlay, updateCartQuantity, removeFromCart, openOverlay, navigateTo } = useApp();
  return (
    <CartDrawer
      isOpen
      onClose={closeOverlay}
      cart={cart}
      onUpdateQuantity={updateCartQuantity}
      onRemoveItem={removeFromCart}
      onCheckout={() => openOverlay('/checkout')}
      onContinueShopping={() => navigateTo('shop')}
    />
  );
}
