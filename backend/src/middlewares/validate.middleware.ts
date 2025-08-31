import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

/**
 * Simple validation middleware for request body
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
