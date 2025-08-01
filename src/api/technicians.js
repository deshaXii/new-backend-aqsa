import dbConnect from "../utils/dbConnect.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

/* ✅ دالة للتحقق من المستخدم */
function authUser(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  await dbConnect();
  const user = authUser(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const { method } = req;

  try {
    /* -------------------- 📌 GET /api/technicians -------------------- */
    if (method === "GET") {
      const techs = await User.find(); // ✅ الأدمن + كل الفنيين
      return res.status(200).json(techs);
    }

    /* -------------------- 📌 POST /api/technicians -------------------- */
    if (method === "POST") {
      const { name, username, password, permissions } = req.body;

      // تحقق من عدم وجود يوزر بنفس الاسم
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).json({ message: "اسم المستخدم موجود بالفعل" });
      }

      // إنشاء الفني الجديد
      const tech = await User.create({
        name,
        username,
        password,
        role: "technician",
        permissions: permissions || {
          addRepair: false,
          editRepair: false,
          deleteRepair: false,
          receiveDevice: false,
        },
      });

      return res.status(201).json(tech);
    }

    /* -------------------- 📌 PUT /api/technicians/:id -------------------- */
    if (method === "PUT") {
      const { id } = req.query;
      const updatedTech = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedTech)
        return res.status(404).json({ message: "الفني غير موجود" });
      return res.status(200).json(updatedTech);
    }

    /* -------------------- 📌 DELETE /api/technicians/:id -------------------- */
    if (method === "DELETE") {
      const { id } = req.query;
      const deletedTech = await User.findByIdAndDelete(id);
      if (!deletedTech)
        return res.status(404).json({ message: "الفني غير موجود" });
      return res.status(200).json({ message: "تم حذف الفني بنجاح" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("خطأ في technicians API:", err);
    return res.status(500).json({ message: "فشل في تنفيذ العملية" });
  }
}
