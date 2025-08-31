import { Request } from "express";
import multer from "multer";
import {
  ALLOWED_MIME_TYPES,
  FILE_FIELD_NAME,
  MAX_FILES,
  MULTER_CONFIG,
  UPLOAD_ERROR_MESSAGES,
} from "../config/upload.config";
import { BadRequestException } from "../utils/app-error";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        `${UPLOAD_ERROR_MESSAGES.INVALID_FILE_TYPE}: ${file.mimetype}`
      )
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  ...MULTER_CONFIG,
});

export const multiUpload = upload.array(FILE_FIELD_NAME, MAX_FILES);
