import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import repairsRoutes from "./routes/repairs.routes.js";
import techniciansRoutes from "./routes/technicians.routes.js";
import invoicesRoutes from "./routes/invoices.routes.js";
import backupRoutes from "./routes/backup.routes.js";
import partsRoutes from "./routes/parts.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/repairs", repairsRoutes);
app.use("/api/technicians", techniciansRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/parts", partsRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
