import Repair from "../models/Repair.model.js";
import Technician from "../models/Technician.model.js";
import Log from "../models/Log.model.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// 📥 استيراد النسخة الاحتياطية
export const importBackup = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "لم يتم رفع أي ملف" });

    const data = JSON.parse(fs.readFileSync(file.path, "utf8"));

    // مسح البيانات القديمة قبل الاستيراد
    await Repair.deleteMany({});
    await Technician.deleteMany({ _id: { $ne: admin._id } }); // يسيب الأدمن بس
    await Log.deleteMany({});

    if (data.repairs?.length) await Repair.insertMany(data.repairs);
    if (data.technicians?.length) await Technician.insertMany(data.technicians);

    fs.unlinkSync(file.path); // مسح الملف بعد الاستيراد
    res.json({ message: "تم استيراد النسخة الاحتياطية بنجاح" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "فشل في استيراد النسخة", error: error.message });
  }
};

// 📤 تصدير النسخة الاحتياطية
export const exportBackup = async (req, res) => {
  try {
    const repairs = await Repair.find({});
    const technicians = await Technician.find();

    const backupData = { repairs, technicians };
    const filename = `backup-${Date.now()}.json`;

    const filePath = path.join(process.cwd(), filename);
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), "utf8");

    res.download(filePath, filename, (err) => {
      fs.unlinkSync(filePath); // مسح الملف بعد التحميل
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "فشل في تصدير النسخة", error: error.message });
  }
};

// 🗑 مسح كل البيانات
export const clearAllData = async (req, res) => {
  try {
    await Repair.deleteMany({});
    await Technician.deleteMany({});
    res.json({ message: "تم مسح كل البيانات بنجاح" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "فشل في مسح البيانات", error: error.message });
  }
};

// 📊 إحصائيات النسخ الاحتياطي
export const getBackupStats = async (req, res) => {
  try {
    const repairsCount = await Repair.countDocuments();
    const techniciansCount = await Technician.countDocuments();

    // تقدير حجم قاعدة البيانات (تقريبي)
    const db = mongoose.connection.db;
    const stats = await db.stats();
    const dbSizeMB = (stats.dataSize / 1024 / 1024).toFixed(2);

    res.json({ repairsCount, techniciansCount, dbSizeMB });
  } catch (error) {
    res
      .status(500)
      .json({ message: "فشل في جلب الإحصائيات", error: error.message });
  }
};
