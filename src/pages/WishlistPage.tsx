import { useApp } from '../context/AppProvider';
import { WishlistDrawer } from '../components/WishlistDrawer';

export function WishlistPage() {
  const { wishlist, closeOverlay, toggleWishlist, addToCart } = useApp();
  return (
    <WishlistDrawer
      isOpen
      onClose={closeOverlay}
      wishlist={wishlist}
      onRemoveFromWishlist={toggleWishlist}
      onAddToCart={(p) => addToCart(p, 1)}
    />
  );
}
