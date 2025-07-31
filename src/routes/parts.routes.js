import express from "express";
import Part from "../models/Part.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all parts
router.get("/", auth, async (req, res) => {
  const parts = await Part.find().populate("usedIn technician");
  res.json(parts);
});

// Add new part
router.post("/", auth, async (req, res) => {
  const { name, source, cost, usedIn, technician } = req.body;
  const part = new Part({ name, source, cost, usedIn, technician });
  await part.save();
  res.status(201).json(part);
});

export default router;
