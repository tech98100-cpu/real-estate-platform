import express from "express";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Inquiry from "../models/Inquiry.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));

// @route GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, totalAgents, totalBuyers, totalProperties, pendingProperties, totalInquiries] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "agent" }),
        User.countDocuments({ role: "buyer" }),
        Property.countDocuments(),
        Property.countDocuments({ status: "pending" }),
        Inquiry.countDocuments(),
      ]);

    res.json({ totalUsers, totalAgents, totalBuyers, totalProperties, pendingProperties, totalInquiries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/admin/properties (all, any status)
router.get("/properties", async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("agent", "name email agencyName")
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/admin/properties/:id/status
router.put("/properties/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // approved | rejected
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/admin/properties/:id
router.delete("/properties/:id", async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
