import Repair from "../models/Repair.model.js";
import Technician from "../models/Technician.model.js";

// 🧾 حساب الإحصائيات اليومية للفواتير
export const getInvoicesStats = async (req, res) => {
  try {
    const { start, end } = req.query;

    const startDate = start ? new Date(start) : new Date();
    const endDate = end ? new Date(end) : new Date();
    endDate.setHours(23, 59, 59, 999);

    const repairs = await Repair.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).populate("technician");

    let totalProfit = 0;
    let totalPartsCost = 0;
    const technicianProfits = {};

    repairs.forEach((r) => {
      totalProfit += r.profit || 0;
      totalPartsCost += r.totalPartsCost || 0;

      if (r.technician) {
        const techName = r.technician.name;
        technicianProfits[techName] =
          (technicianProfits[techName] || 0) + (r.profit || 0) / 2;
      }
    });

    const techArray = Object.entries(technicianProfits).map(
      ([name, profit]) => ({
        technicianName: name,
        profit,
      })
    );

    res.json({
      totalProfit,
      totalPartsCost,
      technicianProfits: techArray,
      repairs,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "فشل في جلب إحصائيات الفواتير", error: error.message });
  }
};
