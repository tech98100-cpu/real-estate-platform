import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import PropertyCard from "../components/PropertyCard.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  const [filters, setFilters] = useState({
    listingType: searchParams.get("listingType") || "all",
    propertyType: searchParams.get("propertyType") || "all",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    page: 1,
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach((k) => (params[k] === "" || params[k] === "all") && delete params[k]);
      const res = await api.get("/properties", { params });
      setProperties(res.data.properties);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line
  }, [filters]);

  useEffect(() => {
    if (user?.role === "buyer") {
      api.get("/favorites").then((res) => {
        setFavorites(new Set(res.data.map((f) => f.property._id)));
      }).catch(() => {});
    }
  }, [user]);

  const toggleFavorite = async (propertyId) => {
    if (!user) return;
    const res = await api.post(`/favorites/${propertyId}`);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (res.data.favorited) next.add(propertyId);
      else next.delete(propertyId);
      return next;
    });
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <span className="text-gold-dark text-xs font-semibold uppercase tracking-widest">Browse</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mt-1">
          {total} Properties Available
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 sticky top-24">
            <h3 className="flex items-center gap-2 font-semibold text-ink mb-4">
              <SlidersHorizontal size={16} className="text-gold-dark" /> Filters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink/50 uppercase">City</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => updateFilter("city", e.target.value)}
                  placeholder="e.g. Lahore"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-offwhite text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink/50 uppercase">Listing Type</label>
                <select
                  value={filters.listingType}
                  onChange={(e) => updateFilter("listingType", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-offwhite text-sm outline-none"
                >
                  <option value="all">All</option>
                  <option value="rent">For Rent</option>
                  <option value="sell">For Sale</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink/50 uppercase">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => updateFilter("propertyType", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-offwhite text-sm outline-none"
                >
                  <option value="all">All</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="resort">Resort</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-ink/50 uppercase">Min Price</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter("minPrice", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-offwhite text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink/50 uppercase">Max Price</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-offwhite text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink/50 uppercase">Min Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => updateFilter("bedrooms", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-offwhite text-sm outline-none"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {loading ? (
            <p className="text-ink/50">Loading properties...</p>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-black/5 p-12 text-center text-ink/50">
              No properties match your filters. Try adjusting your search.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((p) => (
                  <PropertyCard
                    key={p._id}
                    property={p}
                    onToggleFavorite={user?.role === "buyer" ? toggleFavorite : undefined}
                    isFavorited={favorites.has(p._id)}
                  />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
                      className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                        filters.page === p ? "bg-ink text-offwhite" : "bg-white text-ink/60 hover:bg-gold/20"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
