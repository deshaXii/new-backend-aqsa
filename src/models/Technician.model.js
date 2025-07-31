import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "technician" },
    permissions: {
      addRepair: { type: Boolean, default: false },
      editRepair: { type: Boolean, default: false },
      deleteRepair: { type: Boolean, default: false },
      receiveDevice: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Technician = mongoose.model("Technician", technicianSchema);

export default Technician;
