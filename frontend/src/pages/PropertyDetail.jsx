import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Ruler, Phone, Mail, Building2, CheckCircle2 } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const formatPrice = (price, priceUnit) => {
  const formatted = new Intl.NumberFormat("en-PK").format(price);
  return priceUnit === "monthly" ? `Rs ${formatted}/mo` : `Rs ${formatted}`;
};

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [form, setForm] = useState({ message: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => setProperty(res.data)).catch(() => {});
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("Please log in to contact the agent.");
      return;
    }
    try {
      await api.post("/inquiries", {
        propertyId: id,
        message: form.message,
        phone: form.phone,
      });
      setSent(true);
      setForm({ message: "", phone: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (!property) {
    return <div className="max-w-7xl mx-auto px-6 py-20 text-ink/50">Loading property...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden mb-3 h-96">
            <img
              src={property.images?.[activeImg] || property.images?.[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          {property.images?.length > 1 && (
            <div className="flex gap-3 mb-8">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    activeImg === i ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-ink text-offwhite text-xs font-semibold px-3 py-1 rounded-full uppercase">
              {property.listingType === "rent" ? "For Rent" : "For Sale"}
            </span>
            <span className="bg-gold/20 text-gold-dark text-xs font-semibold px-3 py-1 rounded-full capitalize">
              {property.propertyType}
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-ink mb-2">{property.title}</h1>
          <p className="flex items-center gap-1 text-ink/50 mb-6">
            <MapPin size={16} /> {property.address}, {property.city}
          </p>

          <div className="flex flex-wrap gap-6 bg-white rounded-2xl border border-black/5 p-6 mb-8">
            <span className="flex items-center gap-2 text-sm text-ink/70"><Ruler size={18} className="text-gold-dark" /> {property.area} sq.ft</span>
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-2 text-sm text-ink/70"><BedDouble size={18} className="text-gold-dark" /> {property.bedrooms} Bedrooms</span>
            )}
            <span className="flex items-center gap-2 text-sm text-ink/70"><Bath size={18} className="text-gold-dark" /> {property.bathrooms} Bathrooms</span>
          </div>

          <h2 className="font-display text-xl font-semibold text-ink mb-3">Description</h2>
          <p className="text-ink/70 leading-relaxed mb-8">{property.description}</p>

          {property.amenities?.length > 0 && (
            <>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-2 text-sm text-ink/70">
                    <CheckCircle2 size={16} className="text-gold" /> {a}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6 sticky top-24">
            <span className="font-display text-3xl font-bold gold-gradient-text block mb-4">
              {formatPrice(property.price, property.priceUnit)}
            </span>

            <div className="flex items-center gap-3 border-t border-black/5 pt-4 mb-4">
              <div className="w-11 h-11 rounded-full bg-ink text-offwhite flex items-center justify-center font-semibold">
                {property.agent?.name?.[0] || "A"}
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">{property.agent?.name}</p>
                <p className="text-xs text-ink/50 flex items-center gap-1">
                  <Building2 size={12} /> {property.agent?.agencyName || "Independent Agent"}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-5 text-sm text-ink/60">
              {property.agent?.phone && (
                <p className="flex items-center gap-2"><Phone size={14} className="text-gold-dark" /> {property.agent.phone}</p>
              )}
              {property.agent?.email && (
                <p className="flex items-center gap-2"><Mail size={14} className="text-gold-dark" /> {property.agent.email}</p>
              )}
            </div>

            {sent ? (
              <p className="bg-green-50 text-green-700 text-sm rounded-lg p-3">
                Your inquiry has been sent! The agent will contact you soon.
              </p>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-3">
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="I'm interested in this property..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-offwhite text-sm outline-none resize-none"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Your phone (optional)"
                  className="w-full px-3 py-2 rounded-lg bg-offwhite text-sm outline-none"
                />
                {error && <p className="text-red-600 text-xs">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-ink hover:bg-gold hover:text-ink text-offwhite font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  Contact Agent
                </button>
                {!user && (
                  <p className="text-xs text-ink/40 text-center">
                    <Link to="/login" className="text-gold-dark underline">Log in</Link> to send an inquiry
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
