import { NextFunction, Request, Response } from "express";
import StorageModel from "../models/storage.model";
import { BadRequestException, UnauthorizedException } from "../utils/app-error";
import logger from "../utils/logger";

/**
 * Storage Availability Middleware
 * Validates user has sufficient storage quota before allowing file uploads
 *
 * Process:
 * 1. Extract uploaded files from request
 * 2. Calculate total file size
 * 3. Validate against user's storage quota (2GB default)
 * 4. Check remaining space after current usage
 * 5. Allow/reject upload based on availability
 *
 * Features:
 * - Real-time storage usage calculation
 * - Per-user quota enforcement
 * - Detailed logging for monitoring
 * - Graceful error handling with descriptive messages
 */

/**
 * Middleware to check storage availability before file upload
 * Ensures user doesn't exceed their storage quota
 *
 * @param req - Express request with user context and files
 * @param res - Express response object
 * @param next - Next middleware function
 *
 * @example Usage in routes:
 * ```typescript
 * router.post('/upload',
 *   requireAuth,           // 1. Authentication
 *   multiUpload,           // 2. File processing
 *   CheckStorageAvailability, // 3. Storage validation
 *   uploadController       // 4. Business logic
 * );
 * ```
 *
 * @example Error response when insufficient storage:
 * ```json
 * {
 *   "error": "Insufficient storage. 500MB needed.",
 *   "code": "INSUFFICIENT_STORAGE"
 * }
 * ```
 *
 * @example Success flow:
 * - Files total: 100MB
 * - User quota: 2GB
 * - Current usage: 1.5GB
 * - Remaining: 500MB
 * - Result: ✅ Upload allowed
 */
export const CheckStorageAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract files from request (supports both single and multiple files)
    const files =
      (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);

    // Validate that files were actually uploaded
    if (!files || files.length === 0)
      throw new BadRequestException("No file uploaded");

    // Get authenticated user ID (set by auth middleware)
    const userId = req.user?._id;

    if (!userId) throw new UnauthorizedException("Unauthorized access");

    // Calculate total size of all uploaded files
    const totalFileSize = files.reduce((sum, file) => sum + file.size, 0);

    // Validate storage availability using storage model
    // This checks: current usage + new files <= user quota
    const result = await StorageModel.validateUpload(userId, totalFileSize);

    // Log validation result for monitoring and debugging
    logger.info(`Storage validation result: ${JSON.stringify(result)}`);

    // If validation passes, continue to next middleware
    next();
  } catch (error) {
    // Forward error to error handling middleware
    next(error);
  }
};
