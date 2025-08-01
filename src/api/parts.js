import dbConnect from "../utils/dbConnect.js";
import Part from "../models/Part.model.js";
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

  const { method } = req;

  try {
    /* -------------------- 📌 GET /api/parts -------------------- */
    if (method === "GET") {
      const parts = await Part.find().populate("usedIn technician");
      return res.status(200).json(parts);
    }

    /* -------------------- 📌 POST /api/parts -------------------- */
    if (method === "POST") {
      const { name, source, cost, usedIn, technician } = req.body;

      const part = new Part({
        name,
        source,
        cost,
        usedIn,
        technician,
      });

      await part.save();
      return res.status(201).json(part);
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
