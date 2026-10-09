import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl text-[#D4AF37] mb-4">Page not found</h1>
      <p className="text-neutral-400 mb-6">The page you requested does not exist.</p>
      <Link to="/" className="text-[#D4AF37] underline">Return home</Link>
    </div>
  );
}
