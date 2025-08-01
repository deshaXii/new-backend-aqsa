import express from "express";
import auth from "../middleware/auth.js";
import { getInvoicesStats } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/stats", auth, getInvoicesStats);

export default router;
