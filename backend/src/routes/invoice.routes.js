import express from "express";
import {
  createInvoice,
  getInvoiceDetails,
  addPayment,
  getAllPayments,
  archiveInvoice,
  restoreInvoice,
  getAllInvoices,
} from "../controller/invoice.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/payments/all", authMiddleware, getAllPayments);

// Create Invoice
router.post("/", authMiddleware, createInvoice);

// Get Invoice Details BY ID
router.get("/:id", authMiddleware, getInvoiceDetails);

// Get All Invoices
router.get("/", getAllInvoices);

// Add Payment
router.post("/:id/payments", authMiddleware, addPayment);

// Archive Invoice
router.post("/archive", authMiddleware, archiveInvoice);

// Restore Invoice
router.post("/restore", authMiddleware, restoreInvoice);

export default router;
