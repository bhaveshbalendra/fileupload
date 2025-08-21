import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { HTTPSTATUS } from "../config/http.config";

import { loginService, registerService } from "../services/auth.service";
import { loginSchema, registerSchema } from "../validators/auth.validator";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    await registerService(body);

    res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);

    const result = await loginService(body);

    res.status(HTTPSTATUS.CREATED).json({
      message: "User logged in successfully",
      ...result,
    });
  }
);
