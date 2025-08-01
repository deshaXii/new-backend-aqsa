import express from "express";
import Log from "../models/Log.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all logs or filter by repair
router.get("/", auth, async (req, res) => {
  try {
    const { repairId } = req.query;
    const query = repairId ? { repair: repairId } : {};
    const logs = await Log.find(query)
      .populate("repair", "customerName deviceType")
      .populate("oldTechnician", "name")
      .populate("newTechnician", "name")
      .populate("changedBy", "name")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Error fetching logs" });
  }
});

export default router;
