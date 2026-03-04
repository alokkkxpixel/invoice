import express from "express";
import {
  createInvoice,
  getInvoiceDetails,
  addPayment,
  archiveInvoice,
  restoreInvoice,
  getAllInvoices,
} from "../controller/invoice.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create Invoice
router.post("/", authMiddleware, createInvoice);

// Get Invoice Details BY ID
router.get("/:id", authMiddleware, getInvoiceDetails);

// Get All Invoices
router.get("/", getAllInvoices);

// Add Payment
router.post("/:id/payments", addPayment);

// Archive Invoice
router.post("/archive", archiveInvoice);

// Restore Invoice
router.post("/restore", restoreInvoice);

export default router;
