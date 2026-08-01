import express from "express";
import Property from "../models/Property.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// @route GET /api/properties  (public - approved only, with filters)
router.get("/", async (req, res) => {
  try {
    const {
      search,
      listingType,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      city,
      page = 1,
      limit = 9,
    } = req.query;

    const query = { status: "approved" };

    if (search) query.$text = { $search: search };
    if (listingType && listingType !== "all") query.listingType = listingType;
    if (propertyType && propertyType !== "all") query.propertyType = propertyType;
    if (city) query.city = new RegExp(city, "i");
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate("agent", "name email phone agencyName avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(query),
    ]);

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/properties/:id
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "agent",
      "name email phone agencyName avatar"
    );
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.views += 1;
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/properties  (agent only)
router.post("/", protect, authorize("agent", "admin"), async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      agent: req.user._id,
      status: req.user.role === "admin" ? "approved" : "pending",
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/properties/agent/mine (agent's own listings)
router.get("/agent/mine", protect, authorize("agent", "admin"), async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/properties/:id
router.put("/:id", protect, authorize("agent", "admin"), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this property" });
    }

    Object.assign(property, req.body);
    if (req.user.role === "agent") property.status = "pending"; // re-approval on edit
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/properties/:id
router.delete("/:id", protect, authorize("agent", "admin"), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    await property.deleteOne();
    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
