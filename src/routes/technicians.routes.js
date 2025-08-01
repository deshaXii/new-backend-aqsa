import express from "express";
import User from "../models/User.model.js";
import auth from "../middleware/auth.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get("/", auth, checkAdmin, async (req, res) => {
  try {
    const techs = await User.find(); // ✅ الأدمن + كل الفنيين
    res.json(techs);
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب الفنيين" });
  }
});

// ✅ إضافة فني جديد
router.post("/", auth, checkAdmin, async (req, res) => {
  try {
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
      role: "technician", // مهم جدًا عشان يبان في الفرونت
      permissions: permissions || {
        addRepair: false,
        editRepair: false,
        deleteRepair: false,
        receiveDevice: false,
      },
    });

    res.status(201).json(tech);
  } catch (err) {
    console.error("خطأ في إضافة الفني:", err);
    res.status(500).json({ message: "فشل في إضافة الفني" });
  }
});

// ✅ تعديل فني
router.put("/:id", auth, checkAdmin, async (req, res) => {
  try {
    const updatedTech = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTech)
      return res.status(404).json({ message: "الفني غير موجود" });
    res.json(updatedTech);
  } catch (err) {
    res.status(500).json({ message: "فشل في تعديل الفني" });
  }
});

// ✅ حذف فني
router.delete("/:id", auth, checkAdmin, async (req, res) => {
  try {
    const deletedTech = await User.findByIdAndDelete(req.params.id);
    if (!deletedTech)
      return res.status(404).json({ message: "الفني غير موجود" });
    res.json({ message: "تم حذف الفني بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "فشل في حذف الفني" });
  }
});

export default router;
