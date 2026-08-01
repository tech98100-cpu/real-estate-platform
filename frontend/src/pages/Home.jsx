import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import SearchBar from "../components/SearchBar.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import api from "../api/axios.js";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({ properties: 0, cities: 0, agents: 0 });

  useEffect(() => {
    api
      .get("/properties?limit=6")
      .then((res) => {
        setFeatured(res.data.properties);
        const cities = new Set(res.data.properties.map((p) => p.city));
        setStats({ properties: res.data.total, cities: cities.size || 1, agents: 12 });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-ink overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-gold-dark/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-offwhite/70 text-sm mb-8">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-gold" /> Verified Listings</span>
            <span className="flex items-center gap-2"><Sparkles size={16} className="text-gold" /> AI-Powered Search</span>
            <span className="flex items-center gap-2"><Building2 size={16} className="text-gold" /> {stats.properties}+ Properties</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-offwhite text-center md:text-left max-w-3xl leading-tight">
            Find a home that <span className="gold-gradient-text">feels like you</span>
          </h1>
          <p className="text-offwhite/60 text-center md:text-left max-w-xl mt-4 mb-10">
            Browse verified properties for rent and sale, connect directly with trusted agents,
            and let our AI assistant help you find the perfect match.
          </p>

          <SearchBar />
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-gold-dark text-xs font-semibold uppercase tracking-widest">Handpicked</span>
            <h2 className="font-display text-3xl font-bold text-ink mt-1">Featured Properties</h2>
          </div>
          <Link to="/properties" className="hidden md:flex items-center gap-1 text-sm font-semibold text-ink hover:text-gold-dark transition-colors">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-ink/50">Loading properties...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}
      </section>

      {/* WHY US */}
      <section className="bg-charcoal text-offwhite py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Verified Agents Only",
              desc: "Every listing is reviewed by our admin team before it goes live, so you can browse with confidence.",
            },
            {
              title: "AI Property Assistant",
              desc: "Describe what you want in plain words and get instant, relevant suggestions from our listings.",
            },
            {
              title: "Direct Communication",
              desc: "Message agents directly through the platform — no middlemen, no hidden fees.",
            },
          ].map((f) => (
            <div key={f.title} className="border border-gold/20 rounded-2xl p-8 hover:border-gold/50 transition-colors">
              <h3 className="font-display text-xl font-semibold mb-3 text-gold">{f.title}</h3>
              <p className="text-offwhite/60 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-ink mb-4">Are you an agent?</h2>
        <p className="text-ink/60 max-w-xl mx-auto mb-8">
          List your properties, reach thousands of buyers, and manage everything from one simple dashboard.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 bg-ink hover:bg-gold hover:text-ink text-offwhite font-semibold px-8 py-4 rounded-full transition-colors"
        >
          Start Listing <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
};

export default Home;
