import { useApp } from '../context/AppProvider';
import { CheckoutModal } from '../components/CheckoutModal';

export function CheckoutPage() {
  const { cart, closeOverlay, clearCart, notify } = useApp();
  return (
    <CheckoutModal
      isOpen
      onClose={closeOverlay}
      cart={cart}
      onClearCart={clearCart}
      onSuccessToast={(msg) => notify('Order Placed', msg, 'success')}
    />
  );
}
