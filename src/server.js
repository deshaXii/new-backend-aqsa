import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB Connected");
});

// فقط للتطوير المحلي
import authRoutes from "./api/auth.js";
import backupRoutes from "./api/backup.js";
import invoicesRoutes from "./api/invoices.js";
import logsRoutes from "./api/logs.js";
import notificationsRoutes from "./api/notifications.js";
import partsRoutes from "./api/parts.js";
import repairsRoutes from "./api/repairs.js";
import techniciansRoutes from "./api/technicians.js";
app.use("/api/repairs", repairsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/technicians", techniciansRoutes);

// Vercel requires this to work properly
module.exports = app;

app.listen(5000, () => console.log("Server running on port 5000"));
