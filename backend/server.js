import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import invoiceRoutes from "./src/routes/invoice.routes.js";
import connectToDB from "./src/db/db.js";

import cors from "cors";

const app = express();
connectToDB();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// 👉 Routes here
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on ${process.env.PORT}`),
);
