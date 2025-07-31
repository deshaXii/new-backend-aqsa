import mongoose from "mongoose";

const partSchema = new mongoose.Schema({
  name: { type: String, required: true }, // اسم القطعة
  cost: { type: Number, required: true }, // سعر الجملة (تكلفة)
  source: { type: String, required: true }, // اسم المحل أو "من المحل"
});

const repairSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true }, // اسم العميل
    deviceType: { type: String, required: true }, // نوع الجهاز
    issue: { type: String, required: true }, // نوع العطل
    color: { type: String }, // لون الجهاز
    phone: { type: String, required: true }, // رقم الهاتف

    price: { type: Number, required: true }, // سعر الصيانة (بيع)

    technician: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // الفني المسؤول
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // المستلم

    parts: [partSchema], // قطع الغيار

    totalPartsCost: { type: Number, default: 0 }, // مجموع تكلفة قطع الغيار
    profit: { type: Number, default: 0 }, // الربح المحسوب تلقائيًا

    status: {
      type: String,
      enum: ["مرفوض", "تم التسليم", "مكتمل", "جاري العمل", "في الانتظار"],
      default: "في الانتظار",
    },
    deliveredAt: Date,
    logs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log" }], // سجل التعديلات

    notes: { type: String }, // ملاحظات إضافية

    startTime: { type: Date }, // وقت بدء العمل
    endTime: { type: Date }, // وقت الانتهاء
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Repair", repairSchema);
