import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign } from "lucide-react";

const SearchBar = ({ compact = false }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [listingType, setListingType] = useState("all");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (propertyType !== "all") params.set("propertyType", propertyType);
    if (listingType !== "all") params.set("listingType", listingType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`w-full ${
        compact ? "bg-white" : "bg-white/95 backdrop-blur"
      } rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3 items-stretch`}
    >
      <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl bg-offwhite">
        <MapPin size={18} className="text-gold-dark shrink-0" />
        <input
          type="text"
          placeholder="City or location"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-transparent outline-none w-full text-sm text-ink placeholder:text-ink/40"
        />
      </div>

      <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl bg-offwhite">
        <Home size={18} className="text-gold-dark shrink-0" />
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="bg-transparent outline-none w-full text-sm text-ink"
        >
          <option value="all">All Types</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="apartment">Apartment</option>
          <option value="resort">Resort</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl bg-offwhite">
        <DollarSign size={18} className="text-gold-dark shrink-0" />
        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
          className="bg-transparent outline-none w-full text-sm text-ink"
        >
          <option value="all">Rent or Sell</option>
          <option value="rent">For Rent</option>
          <option value="sell">For Sale</option>
        </select>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-ink hover:bg-gold hover:text-ink text-offwhite font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        <Search size={18} /> Search
      </button>
    </form>
  );
};

export default SearchBar;
