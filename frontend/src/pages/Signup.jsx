import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
    agencyName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await signup(form);
      navigate(user.role === "agent" ? "/agent" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Create Your Account</h1>
        <p className="text-ink/50 text-sm mt-2">Join as a buyer or list your properties as an agent</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <div className="flex gap-3">
          {["buyer", "agent"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                form.role === r ? "bg-ink text-offwhite" : "bg-offwhite text-ink/60"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold text-ink/50 uppercase">Full Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
          />
        </div>

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
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
          />
        </div>

        {form.role === "agent" && (
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Agency Name</label>
            <input
              value={form.agencyName}
              onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
              className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-ink/50 uppercase">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
          />
        </div>

        {error && <p className="text-red-600 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-ink hover:bg-gold hover:text-ink text-offwhite font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          <UserPlus size={16} /> {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/50 mt-6">
        Already have an account? <Link to="/login" className="text-gold-dark font-semibold">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
