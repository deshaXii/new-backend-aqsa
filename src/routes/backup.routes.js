import express from "express";
import {
  getStats,
  exportData,
  importData,
  deleteAllData,
} from "../controllers/backupController.js";
import auth from "../middleware/auth.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get("/stats", auth, checkAdmin, getStats);
router.get("/export", auth, checkAdmin, exportData);
router.post("/import", auth, checkAdmin, importData);
router.delete("/delete", auth, checkAdmin, deleteAllData);

export default router;
