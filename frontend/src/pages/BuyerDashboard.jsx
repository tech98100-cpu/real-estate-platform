import { useEffect, useState } from "react";
import { Heart, MessageSquare } from "lucide-react";
import api from "../api/axios.js";
import PropertyCard from "../components/PropertyCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [tab, setTab] = useState("favorites");

  useEffect(() => {
    api.get("/favorites").then((res) => setFavorites(res.data)).catch(() => {});
    api.get("/inquiries/buyer").then((res) => setInquiries(res.data)).catch(() => {});
  }, []);

  const toggleFavorite = async (propertyId) => {
    await api.post(`/favorites/${propertyId}`);
    setFavorites((prev) => prev.filter((f) => f.property._id !== propertyId));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-1">Welcome, {user?.name?.split(" ")[0]}</h1>
      <p className="text-ink/50 mb-8">Manage your saved properties and inquiries</p>

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setTab("favorites")}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            tab === "favorites" ? "bg-ink text-offwhite" : "bg-white text-ink/60 border border-black/10"
          }`}
        >
          <Heart size={14} /> Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setTab("inquiries")}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            tab === "inquiries" ? "bg-ink text-offwhite" : "bg-white text-ink/60 border border-black/10"
          }`}
        >
          <MessageSquare size={14} /> My Inquiries ({inquiries.length})
        </button>
      </div>

      {tab === "favorites" && (
        favorites.length === 0 ? (
          <p className="text-ink/50 bg-white rounded-2xl border border-black/5 p-10 text-center">
            You haven't saved any properties yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((f) => (
              <PropertyCard
                key={f._id}
                property={f.property}
                onToggleFavorite={toggleFavorite}
                isFavorited={true}
              />
            ))}
          </div>
        )
      )}

      {tab === "inquiries" && (
        inquiries.length === 0 ? (
          <p className="text-ink/50 bg-white rounded-2xl border border-black/5 p-10 text-center">
            You haven't sent any inquiries yet.
          </p>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq._id} className="bg-white rounded-xl border border-black/5 p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink">{inq.property?.title}</p>
                  <p className="text-sm text-ink/50 mt-1">{inq.message}</p>
                </div>
                <span className="text-xs font-semibold capitalize px-3 py-1 rounded-full bg-gold/20 text-gold-dark">
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default BuyerDashboard;
