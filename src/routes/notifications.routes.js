import express from "express";
import auth from "../middleware/auth.js";
import {
  getNotifications,
  markAsRead,
  clearNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", auth, getNotifications);
router.put("/:id/read", auth, markAsRead);
router.delete("/clear", auth, clearNotifications);

export default router;
