import express from "express";
import User from "../models/User.js";
import { generateToken, protect } from "../middleware/auth.js";

const router = express.Router();

// @route POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, agencyName, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === "agent" ? "agent" : "buyer",
      agencyName: agencyName || "",
      phone: phone || "",
    });

    res.status(201).json({
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

export default router;
