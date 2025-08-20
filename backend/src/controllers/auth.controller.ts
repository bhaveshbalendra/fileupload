import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";
import { Env } from "../config/env.config";
import { ErrorCodeEnum } from "../enum/error-code.enum";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import { AppError } from "../utils/app-error";
import { compareValue } from "../utils/bcrypt";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const signupSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError("Invalid input", ErrorCodeEnum.VALIDATION_ERROR, 400);
  }
  const { name, email, password } = parsed.data;

  const exists = await UserModel.findOne({ email });
  if (exists) {
    throw new AppError(
      "Email already in use",
      ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS,
      409
    );
  }

  const user = await UserModel.create({ name, email, password });
  res.status(201).json({ success: true, user: user.omitPassword() });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      "Invalid credentials",
      ErrorCodeEnum.VALIDATION_ERROR,
      400
    );
  }
  const { email, password } = parsed.data;

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(
      "User not found",
      ErrorCodeEnum.AUTH_USER_NOT_FOUND,
      404
    );
  }
  const isValid = await compareValue(password, user.password);
  if (!isValid) {
    throw new AppError(
      "Incorrect email or password",
      ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS,
      401
    );
  }

  const session = await SessionModel.create({
    userId: user._id,
    userAgent: req.headers["user-agent"] || "",
    ipAddress:
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "",
    expiresAt: new Date(Date.now() + parseTtlToMs(Env.REFRESH_TOKEN_TTL)),
  });

  const accessToken = signAccessToken({
    sub: String(user._id),
    sessionId: String(session._id),
  });
  const refreshToken = signRefreshToken({
    sub: String(user._id),
    sessionId: String(session._id),
  });

  setRefreshCookie(res, refreshToken);

  res
    .status(200)
    .json({ success: true, accessToken, user: user.omitPassword() });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = getRefreshCookie(req);
  if (!token) {
    throw new AppError(
      "Refresh token missing",
      ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND,
      401
    );
  }
  const payload = verifyRefreshToken(token);
  if (!payload) {
    throw new AppError(
      "Invalid refresh token",
      ErrorCodeEnum.AUTH_INVALID_TOKEN,
      401
    );
  }
  const session = await SessionModel.findById(payload.sessionId);
  if (
    !session ||
    session.isRevoked ||
    session.expiresAt.getTime() < Date.now()
  ) {
    throw new AppError(
      "Session expired",
      ErrorCodeEnum.AUTH_INVALID_TOKEN,
      401
    );
  }
  const newAccess = signAccessToken({
    sub: payload.sub,
    sessionId: payload.sessionId,
  });
  const newRefresh = signRefreshToken({
    sub: payload.sub,
    sessionId: payload.sessionId,
  });
  setRefreshCookie(res, newRefresh);
  res.status(200).json({ success: true, accessToken: newAccess });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = getRefreshCookie(req);
  if (token) {
    const payload = verifyRefreshToken(token);
    if (payload) {
      await SessionModel.findByIdAndUpdate(payload.sessionId, {
        isRevoked: true,
      });
    }
  }
  clearRefreshCookie(res);
  res.status(200).json({ success: true });
});

function parseTtlToMs(ttl: string): number {
  // supports formats like 15m, 7d, 1h
  const match = ttl.match(/^(\d+)([smhd])$/);
  if (!match) return 0;
  const value = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

function setRefreshCookie(res: Response, token: string) {
  const isProd = Env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: parseTtlToMs(Env.REFRESH_TOKEN_TTL),
    path: "/auth/refresh",
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie("refreshToken", { path: "/auth/refresh" });
}

function getRefreshCookie(req: Request): string | null {
  // @ts-ignore
  return (req.cookies && req.cookies.refreshToken) || null;
}
