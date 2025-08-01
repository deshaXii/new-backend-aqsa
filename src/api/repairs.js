import dbConnect from "../utils/dbConnect.js";
import Repair from "../models/Repair.model.js";
import Technician from "../models/Technician.model.js";
import { calculateProfit } from "../utils/calculateProfit.js";
import jwt from "jsonwebtoken";

// ✅ دالة للتحقق من المستخدم من التوكن
async function auth(req) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // { id, role, permissions }
  } catch (err) {
    return null;
  }
}

// ✅ الوظيفة الرئيسية
export default async function handler(req, res) {
  await dbConnect();

  const user = await auth(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { method, query } = req;

  try {
    /* -------------------- 📌 1. جلب جميع الصيانات -------------------- */
    if (method === "GET" && !query.id) {
      const repairs = await Repair.find()
        .populate("technician", "name")
        .populate("recipient", "name");
      return res.status(200).json(repairs);
    }

    /* -------------------- 📌 2. جلب صيانة واحدة -------------------- */
    if (method === "GET" && query.id) {
      const repair = await Repair.findById(query.id)
        .populate("technician recipient")
        .exec();
      if (!repair)
        return res.status(404).json({ message: "الصيانة غير موجودة" });
      return res.status(200).json(repair);
    }

    /* -------------------- 📌 3. إنشاء صيانة جديدة -------------------- */
    if (method === "POST") {
      if (!(user.role === "admin" || user.permissions?.addRepair)) {
        return res.status(403).json({ message: "ليس لديك صلاحية إضافة صيانة" });
      }

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

      const partsArray = Array.isArray(parts) ? parts : [];
      const { totalPartsCost, profit } = calculateProfit(
        price || 0,
        partsArray
      );

      const repair = new Repair({
        customerName,
        deviceType,
        issue,
        color,
        phone,
        price,
        parts: partsArray,
        technician,
        recipient,
        totalPartsCost,
        profit,
        notes,
      });

      await repair.save();
      return res.status(201).json(repair);
    }

    /* -------------------- 📌 4. تعديل الصيانة -------------------- */
    if (method === "PUT") {
      if (!(user.role === "admin" || user.permissions?.editRepair)) {
        return res.status(403).json({ message: "ليس لديك صلاحية تعديل صيانة" });
      }

      const { id } = query;
      const repair = await Repair.findById(id);
      if (!repair)
        return res.status(404).json({ message: "الصيانة غير موجودة" });

      // التحقق من كلمة المرور لو المستخدم فني
      if (user.role !== "admin" && req.body.password) {
        const technicianUser = await Technician.findById(user.id);
        if (!technicianUser || technicianUser.password !== req.body.password) {
          return res.status(403).json({ message: "كلمة المرور غير صحيحة" });
        }
      }

      Object.assign(repair, req.body);
      const { totalPartsCost, profit } = calculateProfit(
        repair.price || 0,
        repair.parts || []
      );
      repair.totalPartsCost = totalPartsCost;
      repair.profit = profit;

      await repair.save();
      return res.status(200).json(repair);
    }

    /* -------------------- 📌 5. حذف صيانة -------------------- */
    if (method === "DELETE") {
      if (!(user.role === "admin" || user.permissions?.deleteRepair)) {
        return res.status(403).json({ message: "ليس لديك صلاحية حذف صيانة" });
      }

      const { id } = query;
      const repair = await Repair.findByIdAndDelete(id);
      if (!repair)
        return res.status(404).json({ message: "الصيانة غير موجودة" });

      return res.status(200).json({ message: "تم حذف الصيانة بنجاح" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
