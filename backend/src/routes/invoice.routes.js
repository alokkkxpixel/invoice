import express from "express";
import {
  createInvoice,
  getInvoiceDetails,
  addPayment,
  archiveInvoice,
  restoreInvoice,
} from "../controller/invoice.controller.js";

const router = express.Router();

// Create Invoice
router.post("/", createInvoice);

// 🔹 1. Get Invoice Details
router.get("/:id", getInvoiceDetails);

// 🔹 2. Add Payment
router.post("/:id/payments", addPayment);

// 🔹 3. Archive Invoice
router.post("/archive", archiveInvoice);

// 🔹 4. Restore Invoice (prompt didn't specify path, assuming /restore)
router.post("/restore", restoreInvoice);

export default router;
