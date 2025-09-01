import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { HTTPSTATUS } from "../config/http.config";
import {
  createApiKeyService,
  deleteApiKeyService,
  getAllApiKeysService,
} from "../services/apikey.service";
import {
  createApiKeySchema,
  deleteApiKeySchema,
} from "../validators/apikey.validator";

export const createApiKeyController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { name } = createApiKeySchema.parse(req.body);

    const { rawKey } = await createApiKeyService(userId, name);

    res.status(HTTPSTATUS.OK).json({
      message: "API key created successfully",
      key: rawKey,
    });
  }
);

export const getAllApiKeysController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 10,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };

    const result = await getAllApiKeysService(userId, pagination);

    res.status(HTTPSTATUS.OK).json({
      message: "API keys retrieved successfully",
      ...result,
    });
  }
);

export const deleteApiKeyController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { id } = deleteApiKeySchema.parse(req.params);

    const result = await deleteApiKeyService(userId, id);

    res.status(HTTPSTATUS.OK).json({
      message: "API key deleted successfully",
      data: result,
    });
  }
);
