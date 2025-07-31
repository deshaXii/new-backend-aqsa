import express from "express";
import Repair from "../models/Repair.model.js";
import auth from "../middleware/auth.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get("/", auth, checkAdmin, async (req, res) => {
  const { start, end } = req.query;
  const filter = {};

  if (start && end) {
    filter.createdAt = {
      $gte: new Date(start),
      $lte: new Date(end),
    };
  }

  const repairs = await Repair.find(filter).populate("technician");

  let totalProfit = 0;
  const technicianProfits = {};
  const partSuppliers = {};

  for (let repair of repairs) {
    totalProfit += repair.profit || 0;

    if (repair.technician) {
      const techId = repair.technician._id;
      if (!technicianProfits[techId]) {
        technicianProfits[techId] = { name: repair.technician.name, total: 0 };
      }
      technicianProfits[techId].total += (repair.profit || 0) / 2;
    }

    for (let part of repair.parts || []) {
      if (!partSuppliers[part.source]) {
        partSuppliers[part.source] = [];
      }
      partSuppliers[part.source].push({
        device: repair.deviceType,
        cost: part.cost,
        name: part.name,
        technician: repair.technician?.name || "",
      });
    }
  }

  res.json({ totalProfit, technicianProfits, partSuppliers });
});

export default router;
