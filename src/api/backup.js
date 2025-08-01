import dbConnect from "../utils/dbConnect.js";
import Repair from "../models/Repair.model.js";
import Technician from "../models/Technician.model.js";
import Log from "../models/Log.model.js";
import jwt from "jsonwebtoken";

/* ✅ دالة للتحقق من الأدمن */
async function authAdmin(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "admin") return decoded;
    return null;
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  await dbConnect();
  const { method, query } = req;

  const user = await authAdmin(req);
  if (!user) return res.status(403).json({ message: "Admin only" });

  try {
    /* -------------------- 📌 GET /api/backup -------------------- */
    if (method === "GET") {
      const repairCount = await Repair.countDocuments();
      const technicianCount = await Technician.countDocuments();

      // تقدير تقريبي لحجم قاعدة البيانات بالميجا
      const dbSizeMB = (repairCount * 0.002 + technicianCount * 0.001).toFixed(
        2
      );
      const usagePercent = ((dbSizeMB / 512) * 100).toFixed(1);

      return res.status(200).json({
        repairs: repairCount,
        technicians: technicianCount,
        dbSizeMB,
        usagePercent,
        warning: usagePercent >= 90,
      });
    }

    /* -------------------- 📌 DELETE /api/backup?clear=true -------------------- */
    if (method === "DELETE" && query.clear === "true") {
      const admin = await Technician.findOne({ role: "admin" });

      await Repair.deleteMany({});
      await Log.deleteMany({});
      await Technician.deleteMany({ _id: { $ne: admin?._id } });

      return res
        .status(200)
        .json({ message: "تم مسح كل البيانات ماعدا الأدمن" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
