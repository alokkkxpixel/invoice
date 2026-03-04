import Invoice from "../model/Invoice.js";
import InvoiceLine from "../model/InvoiceLine.js";
import Payment from "../model/Payment.js";
import mongoose from "mongoose";

// Create Invoice (Helper to test the module)
export const createInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      customerName,
      issueDate,
      customerEmail,
      customerAddress,
      dueDate,
      lineItems, // Array of { description, quantity, unitPrice }
    } = req.body;

    const userId = req.userId;

    let total = 0;
    lineItems.forEach((item) => {
      total += item.quantity * item.unitPrice;
    });

    const invoice = new Invoice({
      invoiceNumber,
      customerName,
      issueDate,
      customerEmail,
      customerAddress,
      dueDate,
      total,
      balanceDue: total,
      userId,
    });

    await invoice.save();

    const lines = lineItems.map((item) => ({
      ...item,
      invoiceId: invoice._id,
      lineTotal: item.quantity * item.unitPrice,
    }));

    await InvoiceLine.insertMany(lines);

    res.status(201).json({ invoice, lines });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 1. Get Invoice Details
export const getInvoiceDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Invoice ID" });
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const lineItems = await InvoiceLine.find({ invoiceId: id });
    const payments = await Payment.find({ invoiceId: id });

    res.status(200).json({
      invoice,
      lineItems,
      payments,
      // The following are included in the invoice object but explicitly returned if needed
      total: invoice.total,
      amountPaid: invoice.amountPaid,
      balanceDue: invoice.balanceDue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 2. Add Payment
export const addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Invoice ID" });
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Rules
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (amount > invoice.balanceDue) {
      return res.status(400).json({ message: "Amount exceeds balance due" });
    }

    // Create Payment
    const payment = new Payment({
      invoiceId: id,
      amount,
      paymentDate: new Date(),
    });
    await payment.save();

    // Update Invoice
    invoice.amountPaid += amount;
    invoice.balanceDue -= amount;

    if (invoice.balanceDue <= 0) {
      invoice.status = "PAID";
      invoice.balanceDue = 0; // Ensure no negative balance
    }

    await invoice.save();

    res.status(201).json({
      message: "Payment added successfully",
      payment,
      updatedInvoice: invoice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 3. Archive Invoice
export const archiveInvoice = async (req, res) => {
  try {
    const { id } = req.body; // Assuming ID is passed in body as per requested path structure

    if (!id) {
      return res.status(400).json({ message: "Invoice ID is required" });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true },
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice archived", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 4. Restore Invoice
export const restoreInvoice = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Invoice ID is required" });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { isArchived: false },
      { new: true },
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice restored", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
