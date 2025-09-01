import { NextFunction, Request, Response } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passportAuthenticateJwt(req, res, next);
};
