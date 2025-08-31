import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

// Rate limiter types
export interface IRateLimiter {
  windowMs?: number;
  max?: number;
  message?: string;
}

// Validation middleware types
export type ValidatorFunction = (
  schema: ZodSchema
) => (req: Request, res: Response, next: NextFunction) => void;

// Storage middleware types
export interface StorageCheckResult {
  allowed: boolean;
  message?: string;
}

// Upload middleware types
export interface UploadMiddlewareOptions {
  maxFiles: number;
  maxFileSize: number;
  allowedMimeTypes: string[];
}
