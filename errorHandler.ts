// backend/src/utils/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import logger from "./logger";

/**
 * Custom Error class to attach status codes and messages.
 */
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Express global error handler middleware.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`[${req.method}] ${req.originalUrl} → ${message}`);

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

/**
 * Async wrapper for controllers
 * Example:
 * router.get('/', asyncHandler(async (req,res)=>{ ... }))
 */
export function asyncHandler(fn: Function) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
