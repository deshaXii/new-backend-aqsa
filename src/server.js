import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import repairsRoutes from "./routes/repairs.routes.js";
import techniciansRoutes from "./routes/technicians.routes.js";
import partsRoutes from "./routes/parts.routes.js";
import backupRoutes from "./routes/backup.routes.js";
import invoicesRoutes from "./routes/invoices.routes.js";
import logRoutes from "./routes/logs.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/repairs", repairsRoutes);
app.use("/api/technicians", techniciansRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/notifications", notificationsRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("DB Connection Error:", err));
