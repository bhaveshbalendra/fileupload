import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { HTTPSTATUS } from "../config/http.config";

import { loginService, registerService } from "../services/auth.service";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    // Body already validated by middleware
    await registerService(req.body);

    res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    // Body already validated by middleware
    const result = await loginService(req.body);

    res.status(HTTPSTATUS.CREATED).json({
      message: "User logged in successfully",
      ...result,
    });
  }
);
