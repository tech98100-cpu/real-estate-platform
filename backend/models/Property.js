import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    listingType: { type: String, enum: ["rent", "sell"], required: true },
    propertyType: {
      type: String,
      enum: ["house", "villa", "apartment", "resort", "plot", "commercial"],
      required: true,
    },
    price: { type: Number, required: true },
    priceUnit: { type: String, enum: ["total", "monthly"], default: "total" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: Number, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    amenities: [{ type: String }],
    images: [{ type: String }],
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

propertySchema.index({ title: "text", city: "text", address: "text" });

export default mongoose.model("Property", propertySchema);
