import { PRODUCTS as samples, CATEGORIES } from '../src/data/mockData';
import { toStoreProduct, type CatalogProduct } from '../src/features/products/productsApi';
import type { ProductCategory } from '../src/features/productCategories/productCategoriesApi';

export const categories: ProductCategory[] = [...CATEGORIES, { name: 'Screen protectors', slug: 'screen-protectors', description: '' }].map((category, i) => ({ id: i + 1, name: category.name, slug: category.slug, description: category.description, imageUrl: null, isActive: true, createdAt: '', updatedAt: '' }));
export const catalogProducts: CatalogProduct[] = samples.map((sample, i) => {
  const phoneCategories: Record<string, string> = { Apple: 'iphone', Samsung: 'samsung', Google: 'google-pixel' };
  const slug = sample.category === 'smartphones' ? (phoneCategories[sample.brand] ?? 'android-phones') : sample.category === 'cases' ? 'phone-cases' : sample.category.replaceAll('_', '-');
  const category = categories.find((item) => item.slug === slug) ?? categories[0];
  return { id: i + 1, categoryId: category.id, category, name: sample.name, slug: `sample-${i + 1}`, sku: `SKU-${i + 1}`, brand: sample.brand, model: sample.name, summary: sample.specs, description: sample.description, price: sample.price, regularPrice: sample.originalPrice ?? null, stockStatus: sample.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK', quantity: sample.inStock ? 10 : 0, status: 'PUBLISHED', isFeatured: true, warranty: '1 year warranty', features: sample.features ?? [], colors: sample.colors ?? [], images: [sample.image], specifications: [{ title: 'Test specifications', rows: [{ label: 'Test field', value: 'Test value' }] }], createdAt: '', updatedAt: '' };
});
export const products = catalogProducts.map(toStoreProduct);
