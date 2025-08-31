import { Router } from "express";
import {
  deleteFilesController,
  downloadFilesController,
  getAllFilesController,
  uploadFilesViaWebController,
} from "../../controllers/files.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { CheckStorageAvailability } from "../../middlewares/check-storage.middleware";
import { multiUpload } from "../../middlewares/upload.middleware";
import { validateBody } from "../../middlewares/validate.middleware";
import {
  deleteFilesSchema,
  downloadFilesSchema,
} from "../../validators/files.validator";

const filesRoutes = Router();

filesRoutes.post(
  "/upload",
  requireAuth, // 1. Authentication
  multiUpload, // 2. File processing
  CheckStorageAvailability, // 3. Storage check
  uploadFilesViaWebController // 4. Business logic
);

filesRoutes.post(
  "/download",
  requireAuth, // 1. Authentication
  validateBody(downloadFilesSchema), // 2. Validation
  downloadFilesController // 3. Business logic
);

filesRoutes.get(
  "/all",
  requireAuth, // 1. Authentication
  getAllFilesController // 2. Business logic
);

filesRoutes.delete(
  "/bulk-delete",
  requireAuth, // 1. Authentication
  validateBody(deleteFilesSchema), // 2. Validation
  deleteFilesController // 3. Business logic
);

export default filesRoutes;
