import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import invoiceRoutes from "./src/routes/invoice.routes.js";
import connectToDB from "./src/db/db.js";

const app = express();
connectToDB();
app.use(express.json());
app.use(cookieParser());

// 👉 Routes here
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server running on ${process.env.PORT}`),
);
