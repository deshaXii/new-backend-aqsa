import express from "express";
import auth from "../middleware/auth.js";
import checkAdmin from "../middleware/checkAdmin.js";
import Repair from "../models/Repair.model.js";
import Technician from "../models/Technician.model.js";
import Log from "../models/Log.model.js";

const router = express.Router();

// مسح كل البيانات ما عدا الأدمن
router.delete("/clear", auth, checkAdmin, async (req, res) => {
  try {
    const admin = await Technician.findOne({ role: "admin" });

    await Repair.deleteMany({});
    await Log.deleteMany({});
    await Technician.deleteMany({ _id: { $ne: admin?._id } });

    res.json({ message: "تم مسح كل البيانات ماعدا الأدمن" });
  } catch (err) {
    res.status(500).json({ message: "فشل في مسح البيانات" });
  }
});

// Endpoint لجلب إحصائيات حجم قاعدة البيانات وعدد الفنيين والصيانات
router.get("/stats", auth, checkAdmin, async (req, res) => {
  try {
    const repairCount = await Repair.countDocuments();
    const technicianCount = await Technician.countDocuments();
    const dbSizeMB = (repairCount * 0.002 + technicianCount * 0.001).toFixed(2); // تقدير تقريبي

    const usagePercent = ((dbSizeMB / 512) * 100).toFixed(1);

    res.json({
      repairs: repairCount,
      technicians: technicianCount,
      dbSizeMB,
      usagePercent,
      warning: usagePercent >= 90,
    });
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب إحصائيات النسخ الاحتياطي" });
  }
});

export default router;
