import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Repair from "../models/Repair.model.js";
import Log from "../models/Log.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aqsa";

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("🗑️ مسح كل البيانات القديمة...");
    await Repair.deleteMany({});
    await Log.deleteMany({});
    await User.deleteMany({});

    console.log("➕ إنشاء الأدمن الافتراضي...");
    await User.create({
      name: "Admin",
      username: "admin",
      password: "admin123",
      role: "admin",
      permissions: {
        addRepair: true,
        editRepair: true,
        deleteRepair: true,
        receiveDevice: true,
      },
    });

    console.log("✅ تم إعادة تهيئة قاعدة البيانات بنجاح");
    process.exit();
  } catch (error) {
    console.error("❌ حصل خطأ:", error);
    process.exit(1);
  }
}

seedDatabase();
