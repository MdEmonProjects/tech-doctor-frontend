<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/96c291aa-2718-4dc8-b713-2f9939437b6c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## App routes

Pages: `/`, `/shop`, `/repairs`, `/tracking`, `/trade-in`, `/about`, `/contact`, and `/faq`.

Cart, wishlist, search, checkout, product details, and repair booking also have URLs: `/cart`, `/wishlist`, `/search`, `/checkout`, `/products/:productId`, and `/repairs/book?service=...`. They open over the current page and support direct visits.

Shop filters use query parameters, for example `/shop?category=iphone&sort=price-low`. Supported parameters are `category`, `brand`, `sort`, `inStock`, and `maxPrice`.

Production hosting must serve `index.html` for app paths so direct visits and refreshes work. Vite handles this during development and preview.

Run `npm run lint`, `npm run test:routing`, and `npm run build` to validate the app. Routing smoke tests check page rendering, overlay URLs, missing routes, and catalog filters; they do not simulate browser interactions.

## Project structure

- `src/pages`: complete page implementations and route entry points for overlays.
- `src/layouts/MainLayout.tsx`: announcement bar, header, footer, toasts, and an `Outlet` for page content.
- `src/layouts/OverlayLayout.tsx`: shared overlay styling, Escape dismissal, and background scroll locking.
- `src/routes/AppRoutes.tsx`: nested page and overlay routes. Add new pages here.
- `src/context/AppProvider.tsx`: typed cart, wishlist, toast, and navigation state shared through `useApp()`.
- `src/components`: reusable UI sections, cards, drawers, and forms.

React 19 declarations are supplied by `@types/react` and `@types/react-dom`. TypeScript runs in strict mode; `npm run lint` checks the full application and route tests.

## Adding private routes

`src/routes/ProtectedRoute.tsx` is ready to use with a future authentication provider. It withholds private content while authentication loads, redirects signed-out users, and stores the requested location in `location.state.from` for returning after login. Authentication and a login page are not implemented yet.

Inside the `MainLayout` route in `AppRoutes.tsx`, add a guarded group:

```tsx
<Route element={
  <ProtectedRoute
    isAuthenticated={Boolean(user)}
    isLoading={isAuthLoading}
    redirectTo="/login"
  />
}>
  <Route path="account" element={<AccountPage />} />
  <Route path="orders" element={<OrdersPage />} />
</Route>
```

Import `ProtectedRoute` and the new pages, get `user` and `isAuthLoading` from your authentication provider, and add a public `/login` page. Protected groups can also contain another layout using `Outlet`. Backend APIs must enforce authorization independently of the client route guard.
