import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Ruler, Heart } from "lucide-react";

const formatPrice = (price, priceUnit) => {
  const formatted = new Intl.NumberFormat("en-PK").format(price);
  return priceUnit === "monthly" ? `Rs ${formatted}/mo` : `Rs ${formatted}`;
};

const PropertyCard = ({ property, onToggleFavorite, isFavorited }) => {
  const cover = property.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800";

  return (
    <div className="tilt-card bg-white rounded-2xl overflow-hidden shadow-md border border-black/5">
      <div className="relative h-56 overflow-hidden">
        <img src={cover} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-ink text-offwhite text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {property.listingType === "rent" ? "Rent" : "Sell"}
          </span>
          <span className="bg-white/90 text-ink text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {property.propertyType}
          </span>
        </div>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(property._id)}
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
            aria-label="Toggle favorite"
          >
            <Heart size={16} className={isFavorited ? "fill-gold text-gold" : "text-ink"} />
          </button>
        )}
      </div>

      <div className="p-5">
        <Link to={`/properties/${property._id}`}>
          <h3 className="font-display text-lg font-semibold text-ink mb-1 hover:text-gold-dark transition-colors line-clamp-1">
            {property.title}
          </h3>
        </Link>
        <p className="flex items-center gap-1 text-sm text-ink/50 mb-3">
          <MapPin size={14} /> {property.address}, {property.city}
        </p>

        <div className="flex items-center gap-4 text-sm text-ink/60 border-t border-black/5 pt-3 mb-3">
          <span className="flex items-center gap-1"><Ruler size={14} /> {property.area} sq.ft</span>
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1"><BedDouble size={14} /> {property.bedrooms} Bed</span>
          )}
          <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms} Bath</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold gold-gradient-text">
            {formatPrice(property.price, property.priceUnit)}
          </span>
          <Link
            to={`/properties/${property._id}`}
            className="text-xs font-semibold text-ink border border-ink/20 hover:border-gold hover:text-gold-dark px-4 py-2 rounded-full transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
