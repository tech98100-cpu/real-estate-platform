import express from "express";
import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// @route POST /api/inquiries  (buyer sends inquiry)
router.post("/", protect, async (req, res) => {
  try {
    const { propertyId, message, phone } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const inquiry = await Inquiry.create({
      property: propertyId,
      buyer: req.user._id,
      agent: property.agent,
      name: req.user.name,
      email: req.user.email,
      phone: phone || req.user.phone,
      message,
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/inquiries/agent (agent's received inquiries)
router.get("/agent", protect, authorize("agent", "admin"), async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ agent: req.user._id })
      .populate("property", "title images")
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/inquiries/buyer (buyer's sent inquiries)
router.get("/buyer", protect, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ buyer: req.user._id })
      .populate("property", "title images")
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/inquiries/:id/status
router.put("/:id/status", protect, authorize("agent", "admin"), async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    inquiry.status = req.body.status;
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
