import { NextFunction, Request, Response } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.user);
  passportAuthenticateJwt(req, res, next);
};
