import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    repair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repair",
      required: true,
    },
    action: String, // مثال: "تغيير فني", "تحديث الحالة", إلخ
    fromTechnician: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toTechnician: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // مثال: "تغيير الحالة", "تغيير الفني"
    oldValue: { type: String },
    newValue: { type: String },
    field: String,
    fromValue: String,
    toValue: String,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);
