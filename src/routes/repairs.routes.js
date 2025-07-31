import express from "express";
import Repair from "../models/Repair.model.js";
import auth from "../middleware/auth.js";
import checkPermission from "../middleware/checkPermission.js";
import { calculateProfit } from "../utils/calculateProfit.js";

const router = express.Router();

// Get all repairs
router.get("/", auth, async (req, res) => {
  try {
    const repairs = await Repair.find().populate("technician recipient");
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ message: "فشل في تحميل الصيانات" });
  }
});

// Create a new repair
router.post("/", auth, checkPermission("addRepair"), async (req, res) => {
  try {
    const {
      customerName,
      deviceType,
      issue,
      color,
      phone,
      price,
      parts,
      technician,
      recipient,
      notes,
    } = req.body;

    const { totalPartsCost, profit } = calculateProfit(price, parts);

    const newRepair = new Repair({
      customerName,
      deviceType,
      issue,
      color,
      phone,
      price,
      parts,
      technician,
      recipient,
      totalPartsCost,
      profit,
      notes,
      status: technician ? "جاري العمل" : "في الانتظار",
      startTime: technician ? new Date() : undefined,
    });

    await newRepair.save();
    res.status(201).json(newRepair);
  } catch (err) {
    res.status(500).json({ message: "فشل في إنشاء الصيانة" });
  }
});

// Update repair
router.put("/:id", auth, checkPermission("editRepair"), async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id);
    if (!repair) return res.status(404).json({ message: "الصيانة غير موجودة" });

    const prevTechnician = repair.technician?.toString();
    const { price, parts, status, technician, endTime, recipient, ...rest } =
      req.body;

    // تحديث الحقول العامة
    Object.assign(repair, rest);

    if (typeof price !== "undefined") repair.price = price;
    if (typeof parts !== "undefined") repair.parts = parts;
    if (typeof recipient !== "undefined") repair.recipient = recipient;

    // حساب الربح الجديد إذا تغيرت الأسعار أو القطع
    if (price || parts) {
      const { totalPartsCost, profit } = calculateProfit(
        repair.price,
        repair.parts
      );
      repair.totalPartsCost = totalPartsCost;
      repair.profit = profit;
    }

    // تغيير الفني
    if (technician && technician !== prevTechnician) {
      repair.technician = technician;
      repair.startTime = new Date(); // بداية عمل الفني الجديد
    }

    // تغيير الحالة
    if (status) {
      repair.status = status;
      if (req.body.status === "تم التسليم") {
        repair.deliveredAt = new Date();
      }
    }

    await repair.save();
    res.json(repair);
  } catch (err) {
    res.status(500).json({ message: "فشل في تحديث الصيانة" });
  }
});

export default router;
