import { NextFunction, Request, Response } from "express";
import { Env } from "../config/env.config";
import logger from "../utils/logger";
const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const errorCode = error.errorCode || "INTERNAL_SERVER_ERROR";
  const success = error.success || false;

  if (Env.NODE_ENV === "development") {
    logger.error("Error details:", error);
  }

  if (error.name === "AppError") {
    res.status(statusCode).json({
      statusCode,
      message,
      errorCode,
      success,
    });
  }
  return;
};

export { errorHandler };
