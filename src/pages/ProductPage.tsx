import { Link, useParams } from 'react-router-dom';
import { ProductQuickViewModal } from '../components/ProductQuickViewModal';
import { useApp } from '../context/AppProvider';
import { PRODUCTS } from '../data/mockData';

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { wishlist, toggleWishlist, addToCart, closeOverlay } = useApp();
  const product = PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="fixed inset-0 z-50 bg-[#080808] text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl text-[#D4AF37]">Product not found</h1>
        <Link to="/shop" className="underline">Browse the shop</Link>
      </div>
    );
  }

  return (
    <ProductQuickViewModal
      key={product.id}
      product={product}
      onClose={closeOverlay}
      isInWishlist={wishlist.some((item) => item.id === product.id)}
      onToggleWishlist={toggleWishlist}
      onAddToCart={addToCart}
    />
  );
}
