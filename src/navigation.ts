export const PAGE_PATHS: Record<string, string> = {
  home: '/',
  shop: '/shop',
  repairs: '/repairs',
  tracking: '/tracking',
  tradein: '/trade-in',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
};

export function getNavigationPath(view: string, category?: string) {
  if (view === 'shop' || view === 'accessories' || !PAGE_PATHS[view]) {
    const filter = category ?? (view === 'accessories' ? 'phone-cases' : view === 'shop' ? 'all' : view);
    return filter === 'all' ? '/shop' : `/shop?category=${encodeURIComponent(filter)}`;
  }
  return PAGE_PATHS[view];
}
