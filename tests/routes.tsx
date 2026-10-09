import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../src/routes/ProtectedRoute';
import App from '../src/App';
import { PRODUCTS } from '../src/data/mockData';
import { PAGE_PATHS, getNavigationPath } from '../src/navigation';

const render = (path: string, state?: unknown) => renderToStaticMarkup(
  <MemoryRouter initialEntries={[{ pathname: path.split('?')[0], search: path.includes('?') ? `?${path.split('?')[1]}` : '', state }]}>
    <App />
  </MemoryRouter>,
);

for (const path of Object.values(PAGE_PATHS)) {
  const html = render(path);
  assert.ok(!html.includes('Page not found'), `${path} must render a page`);
  assert.ok(html.includes('href="/shop"'), `${path} must include shared navigation`);
}

for (const [path, content] of [
  ['/cart', 'Cart Items'],
  ['/wishlist', 'Close wishlist'],
  ['/search', 'Close search'],
  ['/checkout', 'Insured Express Checkout'],
  ['/repairs/book', 'Reserve Bench Appointment'],
  [`/products/${PRODUCTS[0].id}`, 'Close modal'],
  ['/products/missing-product', 'Product not found'],
  ['/missing-page', 'Page not found'],
]) {
  assert.ok(render(path).includes(content), `${path} must render ${content}`);
}

for (const [category, productCategory, brand] of [
  ['iphone', 'smartphones', 'Apple'],
  ['samsung', 'smartphones', 'Samsung'],
  ['google-pixel', 'smartphones', 'Google'],
  ['phone-cases', 'cases', undefined],
]) {
  const html = render(getNavigationPath('shop', category));
  for (const product of PRODUCTS) {
    const matches = product.category === productCategory && (!brand || product.brand === brand);
    const escapedName = product.name.replaceAll('&', '&amp;');
    assert.equal(html.includes(escapedName), matches, `${category}: ${product.name}`);
  }
}

const backgroundLocation = { pathname: '/shop', search: '?category=iphone', hash: '', state: null, key: 'shop' };
const modalHtml = render(`/products/${PRODUCTS[0].id}`, { backgroundLocation });
assert.ok(modalHtml.includes('AUTHENTIC ELECTRONICS CATALOG'), 'Product overlay must retain the shop behind it');
assert.ok(modalHtml.includes('Close modal'), 'Product overlay must display its product');
assert.ok(!render('/shop?maxPrice=0').includes(PRODUCTS[0].name), 'Price filters must apply on direct visits');
assert.ok(render('/shop?maxPrice=invalid').includes(PRODUCTS[0].name), 'Invalid prices must use the default');
assert.equal(getNavigationPath('tradein'), '/trade-in');

function renderProtected(isAuthenticated: boolean, isLoading = false) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={['/account']}>
      <Routes>
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading} />}>
          <Route path="account" element={<div>Private account content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}
assert.ok(renderProtected(true).includes('Private account content'), 'Authenticated users must see the nested page');
assert.ok(!renderProtected(false).includes('Private account content'), 'Unauthenticated users must not see private content');
assert.ok(renderProtected(false, true).includes('Checking your session'), 'Pending authentication must display a loading state');
assert.ok(!renderProtected(true, true).includes('Private account content'), 'Pending authentication must withhold private content');

const homeHtml = render('/');
assert.equal((homeHtml.match(/<header\b/g) ?? []).length, 1, 'The shared header must render once');
assert.equal((homeHtml.match(/<footer\b/g) ?? []).length, 1, 'The shared footer must render once');
console.log('Routing smoke tests passed: shared layouts, pages, overlays, missing routes, catalog filters, and private route access states.');
