import express from "express";
import Favorite from "../models/Favorite.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route GET /api/favorites
router.get("/", protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate({
      path: "property",
      populate: { path: "agent", select: "name email phone" },
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/favorites/:propertyId (toggle)
router.post("/:propertyId", protect, async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user._id,
      property: req.params.propertyId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ favorited: false });
    }

    await Favorite.create({ user: req.user._id, property: req.params.propertyId });
    res.json({ favorited: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
