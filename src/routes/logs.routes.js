import express from "express";
import Log from "../models/Log.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:repairId", auth, async (req, res) => {
  const logs = await Log.find({ repair: req.params.repairId })
    .populate("fromTechnician toTechnician changedBy", "name")
    .sort({ createdAt: -1 });

  res.json(logs);
});

export default router;
