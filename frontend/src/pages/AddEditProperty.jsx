import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, Save, X } from "lucide-react";
import api from "../api/axios.js";

const emptyForm = {
  title: "",
  description: "",
  listingType: "sell",
  propertyType: "house",
  price: "",
  priceUnit: "total",
  address: "",
  city: "",
  area: "",
  bedrooms: 0,
  bathrooms: 0,
  amenities: [],
  images: [],
};

const AddEditProperty = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [amenityInput, setAmenityInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      api.get(`/properties/${id}`).then((res) => setForm(res.data)).catch(() => {});
    }
  }, [id, isEdit]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const addAmenity = () => {
    if (!amenityInput.trim()) return;
    update("amenities", [...form.amenities, amenityInput.trim()]);
    setAmenityInput("");
  };

  const addImage = () => {
    if (!imageInput.trim()) return;
    update("images", [...form.images, imageInput.trim()]);
    setImageInput("");
  };

  const generateDescription = async () => {
    if (!form.title || !form.city) {
      setError("Please fill in the title and city before generating a description.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await api.post("/ai/generate-description", {
        title: form.title,
        propertyType: form.propertyType,
        listingType: form.listingType,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        area: form.area,
        city: form.city,
        amenities: form.amenities,
      });
      update("description", res.data.description);
    } catch (err) {
      setError("Couldn't generate a description right now. Please write one manually or try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, price: Number(form.price), area: Number(form.area), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms) };
      if (isEdit) {
        await api.put(`/properties/${id}`, payload);
      } else {
        await api.post("/properties", payload);
      }
      navigate("/agent");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save property.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-1">
        {isEdit ? "Edit Property" : "Add New Property"}
      </h1>
      <p className="text-ink/50 mb-8">
        {isEdit ? "Updating will require re-approval from admin." : "New listings need admin approval before going live."}
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-6 space-y-5">
        <div>
          <label className="text-xs font-semibold text-ink/50 uppercase">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            placeholder="e.g. Modern Villa in DHA Phase 6"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Listing Type</label>
            <select
              value={form.listingType}
              onChange={(e) => update("listingType", e.target.value)}
              className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            >
              <option value="sell">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Property Type</label>
            <select
              value={form.propertyType}
              onChange={(e) => update("propertyType", e.target.value)}
              className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            >
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="resort">Resort</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Price (Rs)</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Price Unit</label>
            <select
              value={form.priceUnit}
              onChange={(e) => update("priceUnit", e.target.value)}
              className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            >
              <option value="total">Total</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">City</label>
            <input
              required
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Address</label>
            <input
              required
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Area (sq.ft)</label>
            <input
              required
              type="number"
              value={form.area}
              onChange={(e) => update("area", e.target.value)}
              className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Bedrooms</label>
            <input
              type="number"
              value={form.bedrooms}
              onChange={(e) => update("bedrooms", e.target.value)}
              className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Bathrooms</label>
            <input
              type="number"
              value={form.bathrooms}
              onChange={(e) => update("bathrooms", e.target.value)}
              className="w-full mt-1 px-3 py-3 rounded-lg bg-offwhite text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-ink/50 uppercase">Description</label>
            <button
              type="button"
              onClick={generateDescription}
              disabled={generating}
              className="flex items-center gap-1 text-xs font-semibold text-gold-dark hover:text-gold disabled:opacity-50"
            >
              <Sparkles size={14} /> {generating ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full px-3 py-3 rounded-lg bg-offwhite text-sm outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-ink/50 uppercase">Amenities</label>
          <div className="flex gap-2 mt-1 mb-2">
            <input
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
              placeholder="e.g. Swimming Pool"
              className="flex-1 px-3 py-2 rounded-lg bg-offwhite text-sm outline-none"
            />
            <button type="button" onClick={addAmenity} className="px-4 bg-offwhite rounded-lg text-sm font-semibold text-ink/60">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.amenities.map((a, i) => (
              <span key={i} className="flex items-center gap-1 bg-gold/10 text-gold-dark text-xs font-semibold px-3 py-1 rounded-full">
                {a}
                <button type="button" onClick={() => update("amenities", form.amenities.filter((_, idx) => idx !== i))}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink/50 uppercase">Image URLs</label>
          <div className="flex gap-2 mt-1 mb-2">
            <input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
              placeholder="Paste image URL"
              className="flex-1 px-3 py-2 rounded-lg bg-offwhite text-sm outline-none"
            />
            <button type="button" onClick={addImage} className="px-4 bg-offwhite rounded-lg text-sm font-semibold text-ink/60">
              Add
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {form.images.map((img, i) => (
              <div key={i} className="relative h-16 rounded-lg overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => update("images", form.images.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/40 mt-2">Tip: use free stock photo URLs from unsplash.com for your portfolio demo.</p>
        </div>

        {error && <p className="text-red-600 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-ink hover:bg-gold hover:text-ink text-offwhite font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "Saving..." : isEdit ? "Update Property" : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
};

export default AddEditProperty;
