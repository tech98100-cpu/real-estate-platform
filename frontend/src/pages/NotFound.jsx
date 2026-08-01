import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-xl mx-auto px-6 py-32 text-center">
    <h1 className="font-display text-5xl font-bold text-ink mb-4">404</h1>
    <p className="text-ink/50 mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/" className="bg-ink hover:bg-gold hover:text-ink text-offwhite font-semibold px-6 py-3 rounded-full transition-colors">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
