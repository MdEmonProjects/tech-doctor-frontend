import { Link, useParams } from 'react-router-dom';
import { ProductQuickViewModal } from '../components/ProductQuickViewModal';
import { useApp } from '../context/AppProvider';
import { toStoreProduct, useGetPublicProductQuery } from '../features/products/productsApi';

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { wishlist, toggleWishlist, addToCart, closeOverlay } = useApp();
  const validId = Boolean(productId && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(productId));
  const { data, isLoading, error, refetch } = useGetPublicProductQuery(productId ?? '', { skip: !validId });
  const product = data ? toStoreProduct(data) : undefined;

  if (isLoading) return <div role="status" className="fixed inset-0 z-50 grid place-items-center bg-[#080808] text-white">Loading product…</div>;
  if (error && !('status' in error && error.status === 404)) return <div role="alert" className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#080808] text-white"><p>Could not load this product.</p><button onClick={() => void refetch()} className="underline">Try again</button><Link to="/shop" className="underline">Back to shop</Link></div>;

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
