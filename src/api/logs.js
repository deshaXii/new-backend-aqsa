import dbConnect from "../utils/dbConnect.js";
import jwt from "jsonwebtoken";
import Log from "../models/Log.model.js";

/* ✅ التحقق من المستخدم */
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
    /* -------------------- 📌 GET /api/logs -------------------- */
    if (method === "GET") {
      const { repairId } = req.query;
      const query = repairId ? { repair: repairId } : {};

      const logs = await Log.find(query)
        .populate("repair", "customerName deviceType")
        .populate("oldTechnician", "name")
        .populate("newTechnician", "name")
        .populate("changedBy", "name")
        .sort({ createdAt: -1 });

      return res.status(200).json(logs);
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Error fetching logs" });
  }
}
