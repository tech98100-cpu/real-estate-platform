import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const dashboardPath = {
  admin: "/admin",
  agent: "/agent",
  buyer: "/dashboard",
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-gold/20">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold text-offwhite">
          <Home className="text-gold" size={26} />
          Estate<span className="gold-gradient-text">ly</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-body text-sm text-offwhite/80">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <Link to="/properties" className="hover:text-gold transition-colors">Properties</Link>
          {user && (
            <Link to={dashboardPath[user.role]} className="hover:text-gold transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="flex items-center gap-2 text-offwhite/80 text-sm">
                <User size={16} className="text-gold" /> {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-offwhite/70 hover:text-gold transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-offwhite/80 hover:text-gold transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gold hover:bg-gold-light text-ink text-sm font-semibold px-5 py-2 rounded-full transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-offwhite" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-charcoal px-6 py-4 flex flex-col gap-4 text-offwhite/80 text-sm border-t border-gold/10">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/properties" onClick={() => setOpen(false)}>Properties</Link>
          {user ? (
            <>
              <Link to={dashboardPath[user.role]} onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="text-gold">Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
