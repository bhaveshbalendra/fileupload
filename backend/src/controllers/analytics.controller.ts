import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { HTTPSTATUS } from "../config/http.config";
import { getUserAnalyticsWithChartService } from "../services/analytics.service";

export const getUserAnalyticsWithChartController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { from, to } = req.query;

    const filter = {
      dateFrom: from ? new Date(from as string) : undefined,
      dateTo: to ? new Date(to as string) : undefined,
    };

    const result = await getUserAnalyticsWithChartService(userId, filter);

    res.status(HTTPSTATUS.OK).json({
      message: "User analytics retrieved successfully",
      ...result,
    });
  }
);
