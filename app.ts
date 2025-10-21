// backend/src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routes/email.routes";
import accountRoutes from "./routes/account.routes";
import replyRoutes from "./routes/reply.routes";
import { errorHandler } from "./utils/errorHandler";
import logger from "./utils/logger";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "ReachInbox Onebox Backend API is running 🚀",
  });
});

// API Routes
app.use("/api/emails", emailRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/emails", replyRoutes); // same prefix, different controller

// Global error handler (must come last)
app.use(errorHandler);

// Handle unknown routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Promise Rejection:", reason);
});

export default app;
