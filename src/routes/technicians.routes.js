import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import auth from "../middleware/auth.js";
import checkAdmin from "../middleware/checkAdmin.js";
import Technician from "../models/Technician.model.js";

const router = express.Router();

// Get all technicians (Admin only)
router.get("/", auth, checkAdmin, async (req, res) => {
  const techs = await Technician.find();
  console.log(techs);
  res.json(techs);
});

// Update technician
router.put("/:id", auth, checkAdmin, async (req, res) => {
  const tech = await Technician.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!tech) return res.status(404).json({ message: "Technician not found" });
  res.json(tech);
});

// Delete technician
router.delete("/:id", auth, checkAdmin, async (req, res) => {
  const tech = await Technician.findByIdAndDelete(req.params.id);
  if (!tech) return res.status(404).json({ message: "Technician not found" });
  res.json({ message: "Technician deleted" });
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
