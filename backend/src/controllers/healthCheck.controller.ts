import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { NotFoundError } from "../utils/app-error";
//Health check controller
const handleHealthCheck = asyncHandler(async (req: Request, res: Response) => {
  //   throw new NotFoundError();
  res.status(200).json({
    message: "Server working welcome to the file upload application",
    success: true,
  });
});

export { handleHealthCheck };
