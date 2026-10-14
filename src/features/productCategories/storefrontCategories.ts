import { CATEGORIES } from '../../data/mockData';
import type { Product } from '../../types';
import { productCategoryImageUrl, type ProductCategory } from './productCategoriesApi';

export function matchesShopCategory(product: Product, slug: string) {
  const phoneBrands: Record<string, string> = { iphone: 'Apple', samsung: 'Samsung', 'google-pixel': 'Google' };
  if (slug === 'all') return true;
  if (slug === 'smartphones' && ['iphone', 'samsung', 'google-pixel', 'android-phones'].includes(product.category)) return true;
  if (product.category === slug) return true;
  if (phoneBrands[slug]) return product.category === 'smartphones' && product.brand === phoneBrands[slug];
  if (slug === 'android-phones') return product.category === 'smartphones' && product.brand !== 'Apple';
  return product.category === (slug === 'phone-cases' ? 'cases' : slug);
}

export function storefrontCategoryImage(category: ProductCategory) {
  if (category.imageUrl === null) return CATEGORIES.find((item) => item.slug === category.slug)?.image ?? '';
  return productCategoryImageUrl(category.imageUrl);
}

export function storefrontCategories(categories?: ProductCategory[], products: Product[] = []) {
  if (!categories) return [];
  return categories.map((category) => {
    return {
      id: String(category.id), name: category.name, slug: category.slug,
      description: category.description ?? '', image: storefrontCategoryImage(category),
      count: products.filter((product) => matchesShopCategory(product, category.slug)).length,
    };
  });
}
