import { matchPath } from 'react-router-dom';
import type { Location } from 'react-router-dom';

export interface OverlayLocationState {
  backgroundLocation?: Location;
}

export function isOverlayPath(pathname: string) {
  return ['/cart', '/wishlist', '/search', '/checkout', '/repairs/book'].some(
    (path) => matchPath(path, pathname) !== null,
  ) || matchPath('/products/:productId', pathname) !== null;
}
