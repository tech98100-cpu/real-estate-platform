import { Link } from "react-router-dom";
import { Home, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-ink border-t border-gold/20 text-offwhite/70">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display text-2xl font-bold text-offwhite mb-3">
            <Home className="text-gold" size={22} />
            Estate<span className="gold-gradient-text">ly</span>
          </div>
          <p className="text-sm leading-relaxed">
            Discover, list, and manage properties with a platform built for
            trust, elegance, and speed.
          </p>
        </div>

        <div>
          <h4 className="text-offwhite font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/properties" className="hover:text-gold transition-colors">All Properties</Link></li>
            <li><Link to="/properties?listingType=rent" className="hover:text-gold transition-colors">For Rent</Link></li>
            <li><Link to="/properties?listingType=sell" className="hover:text-gold transition-colors">For Sale</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-offwhite font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-gold transition-colors">Login</Link></li>
            <li><Link to="/signup" className="hover:text-gold transition-colors">Create Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-offwhite font-semibold mb-3">Connect</h4>
          <div className="flex gap-4">
            <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors"><Instagram size={20} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-gold transition-colors"><Linkedin size={20} /></a>
            <a href="#" aria-label="Email" className="hover:text-gold transition-colors"><Mail size={20} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gold/10 py-4 text-center text-xs text-offwhite/40">
        © {new Date().getFullYear()} Estately. Built for demonstration purposes.
      </div>
    </footer>
  );
};

export default Footer;
