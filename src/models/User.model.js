import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "technician"],
      default: "technician",
    },
    permissions: {
      addRepair: { type: Boolean, default: false },
      editRepair: { type: Boolean, default: false },
      deleteRepair: { type: Boolean, default: false },
      receiveDevice: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
