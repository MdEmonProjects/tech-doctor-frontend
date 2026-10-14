import { useApp } from '../context/AppProvider';
import { SearchOverlay } from '../components/SearchOverlay';

export function SearchPage() {
  const { closeOverlay, openOverlay, bookRepair, navigateTo } = useApp();
  return (
    <SearchOverlay
      isOpen
      onClose={closeOverlay}
      onSelectProduct={(p) => openOverlay(`/products/${p.slug ?? p.id}`)}
      onSelectRepair={bookRepair}
      onSelectCategory={(cat) => navigateTo('shop', cat)}
    />
  );
}
