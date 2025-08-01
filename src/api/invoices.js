import dbConnect from "../utils/dbConnect.js";
import Repair from "../models/Repair.model.js";
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

  if (method === "GET") {
    try {
      const { startDate, endDate } = query;
      const dbQuery = {};

      if (startDate && endDate) {
        dbQuery.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (startDate) {
        dbQuery.createdAt = { $gte: new Date(startDate) };
      } else if (endDate) {
        dbQuery.createdAt = { $lte: new Date(endDate) };
      }

      const repairs = await Repair.find(dbQuery).populate("technician");

      const totalProfit = repairs.reduce((sum, r) => sum + (r.profit || 0), 0);
      const totalPartsCost = repairs.reduce(
        (sum, r) => sum + (r.totalPartsCost || 0),
        0
      );

      const technicianProfits = repairs.reduce((acc, r) => {
        if (!r.technician) return acc;
        const tech = acc.find((t) => t.technicianName === r.technician.name);
        const profitShare = (r.profit || 0) / 2;
        if (tech) tech.profit += profitShare;
        else
          acc.push({ technicianName: r.technician.name, profit: profitShare });
        return acc;
      }, []);

      const partsByShop = {};
      repairs.forEach((r) => {
        (r.parts || []).forEach((part) => {
          const shop = part.source || "المحل";
          if (!partsByShop[shop]) partsByShop[shop] = [];
          partsByShop[shop].push({
            name: part.name,
            cost: part.cost,
            customerName: r.customerName,
            technicianName: r.technician?.name || "-",
          });
        });
      });

      return res.status(200).json({
        totalProfit,
        totalPartsCost,
        technicianProfits,
        repairs,
        partsByShop,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "فشل في جلب بيانات الفواتير" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
