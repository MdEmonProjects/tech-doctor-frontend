import { useApp } from '../context/AppProvider';
import { Hero } from '../components/Hero';
import { TrustBar } from '../components/TrustBar';
import { CategoryGrid } from '../components/CategoryGrid';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { RepairServices } from '../components/RepairServices';
import { RepairBookingSection } from '../components/RepairBookingSection';
import { PromoBanners } from '../components/PromoBanners';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { CustomerReviews } from '../components/CustomerReviews';
import { FAQSection } from '../components/FAQSection';
import { StoreContact } from '../components/StoreContact';
import { Newsletter } from '../components/Newsletter';

export function HomePage() {
  const { wishlist, toggleWishlist, addToCart, openOverlay, navigateTo, bookRepair, notify } = useApp();
  return (
    <>
      {/* Hero Section */}
      <Hero
        onBookRepair={() => openOverlay('/repairs/book')}
        onShopPhones={() => navigateTo('shop', 'smartphones')}
      />

      {/* Trust Benefits Bar */}
      <TrustBar />

      {/* Shop by Category */}
      <CategoryGrid
        onSelectCategory={(slug) => navigateTo('shop', slug)}
      />

      {/* Featured Products Carousel / Grid */}
      <FeaturedProducts
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onQuickView={(p) => openOverlay(`/products/${p.id}`)}
        onViewAllClick={() => navigateTo('shop')}
      />

      {/* Repair Services Section */}
      <RepairServices
        onSelectService={bookRepair}
        onBookRepairClick={() => openOverlay('/repairs/book')}
      />

      {/* Dedicated Repair Booking & Instant Quote Section */}
      <RepairBookingSection
        initialService="Screen & OLED Replacement"
        onSuccessToast={(msg) => notify('Appointment Booked', msg, 'success')}
      />

      {/* Promotional Split Banners */}
      <PromoBanners
        onRepairDealsClick={() => navigateTo('repairs')}
        onNewArrivalsClick={() => navigateTo('shop')}
      />

      {/* Why Choose Tech Doctor (Trust Cards & Metrics) */}
      <WhyChooseUs />

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* FAQ Section */}
      <FAQSection />

      {/* Visit Tech Doctor Store & Contact */}
      <StoreContact
        onSuccessToast={(msg) => notify('Message Sent', msg, 'success')}
      />

      {/* Newsletter Subscription Strip */}
      <Newsletter
        onSuccessToast={(msg) => notify('Newsletter Subscribed', msg, 'success')}
      />
    </>
  );
}
