import dbConnect from "../utils/dbConnect.js";
import jwt from "jsonwebtoken";
import Notification from "../models/Notification.model.js";

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

  const { method } = req;

  try {
    /* -------------------- 📌 GET /api/notifications -------------------- */
    if (method === "GET") {
      const notifications = await Notification.find({ user: user.id }).sort({
        createdAt: -1,
      });
      return res.status(200).json(notifications);
    }

    /* -------------------- 📌 PUT /api/notifications/:id/read -------------------- */
    if (method === "PUT") {
      const { id } = req.query;
      const updated = await Notification.findByIdAndUpdate(
        id,
        { read: true },
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ message: "Notification not found" });

      return res.status(200).json(updated);
    }

    /* -------------------- 📌 DELETE /api/notifications/clear -------------------- */
    if (method === "DELETE") {
      await Notification.deleteMany({ user: user.id });
      return res.status(200).json({ message: "تم مسح جميع الإشعارات" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("خطأ في notifications API:", err);
    return res.status(500).json({ message: "فشل في تنفيذ العملية" });
  }
}
