import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const demoAccounts = [
  { label: "Admin", email: "admin@demo.com", password: "Admin@123" },
  { label: "Agent", email: "agent@demo.com", password: "Agent@123" },
  { label: "Buyer", email: "buyer@demo.com", password: "Buyer@123" },
];

const dashboardPath = { admin: "/admin", agent: "/agent", buyer: "/dashboard" };

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(dashboardPath[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setForm({ email: acc.email, password: acc.password });
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Welcome Back</h1>
        <p className="text-ink/50 text-sm mt-2">Log in to manage your listings or favorites</p>
      </div>

      <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4 mb-6">
        <p className="flex items-center gap-2 text-xs font-semibold text-gold-dark mb-3">
          <Sparkles size={14} /> Demo Login — click to autofill
        </p>
        <div className="flex gap-2">
          {demoAccounts.map((acc) => (
            <button
              key={acc.label}
              onClick={() => fillDemo(acc)}
              className="flex-1 text-xs font-semibold bg-white border border-gold/30 hover:bg-gold hover:text-ink text-ink/70 rounded-lg py-2 transition-colors"
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-ink/50 uppercase">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-ink/50 uppercase">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
          />
        </div>
        {error && <p className="text-red-600 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-ink hover:bg-gold hover:text-ink text-offwhite font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          <LogIn size={16} /> {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/50 mt-6">
        Don't have an account? <Link to="/signup" className="text-gold-dark font-semibold">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
