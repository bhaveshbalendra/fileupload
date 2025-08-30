import { Router } from "express";
import { multiUpload } from "../../config/multer.config";
import {
  deleteFilesController,
  downloadFilesController,
  getAllFilesController,
  uploadFilesViaWebController,
} from "../../controllers/files.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { CheckStorageAvailability } from "../../middlewares/check-storage.middleware";

const filesRoutes = Router();

filesRoutes.post(
  "/upload",
  requireAuth,
  multiUpload,
  CheckStorageAvailability,
  uploadFilesViaWebController
);

filesRoutes.post("/download", requireAuth, downloadFilesController);
filesRoutes.get("/all", requireAuth, getAllFilesController);
filesRoutes.delete("/bulk-delete", requireAuth, deleteFilesController);

export default filesRoutes;
