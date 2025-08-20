import { NextFunction, Request, Response } from "express";
import { ErrorCodeEnum } from "../enum/error-code.enum";
import { AppError } from "../utils/app-error";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role?: string; sessionId?: string };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!token) {
    return next(
      new AppError(
        "Authentication token missing",
        ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND,
        401
      )
    );
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return next(
      new AppError(
        "Invalid or expired token",
        ErrorCodeEnum.AUTH_INVALID_TOKEN,
        401
      )
    );
  }

  req.user = {
    id: payload.sub,
    role: payload.role,
    sessionId: payload.sessionId,
  };
  return next();
};

