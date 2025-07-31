import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import auth from "../middleware/auth.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

// Get all technicians
router.get("/", auth, checkAdmin, async (req, res) => {
  const techs = await User.find({ role: "technician" });
  res.json(techs);
});

// Create new technician
router.post("/", auth, async (req, res) => {
  const { name, username, password, permissions } = req.body;
  const existing = await User.findOne({ username });
  if (existing)
    return res.status(400).json({ message: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    username,
    password: hashed,
    role: "technician",
    permissions,
  });

  await user.save();
  res.status(201).json(user);
});

export default router;
