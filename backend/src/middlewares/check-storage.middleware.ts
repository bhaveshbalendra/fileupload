import { NextFunction, Request, Response } from "express";
import StorageModel from "../models/storage.model";
import { BadRequestException, UnauthorizedException } from "../utils/app-error";
import logger from "../utils/logger";
import { MAX_FILE_SIZE, UPLOAD_ERROR_MESSAGES } from "../config/upload.config";
import { formatBytes } from "../utils/format-byte";

/**
 * Storage Availability Middleware
 * Validates user has sufficient storage quota before allowing file uploads
 *
 * Process:
 * 1. Extract uploaded files from request
 * 2. Validate individual file sizes (200KB max per file)
 * 3. Calculate total file size
 * 4. Validate against user's storage quota (100MB default)
 * 5. Check remaining space after current usage
 * 6. Allow/reject upload based on availability
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
 *   "error": "Insufficient storage. 25MB needed.",
 *   "code": "INSUFFICIENT_STORAGE"
 * }
 * ```
 *
 * @example Success flow:
 * - Files: [file1: 150KB, file2: 100KB]
 * - Total: 250KB
 * - User quota: 100MB
 * - Current usage: 50MB
 * - Remaining: 50MB
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

    // Validate individual file sizes
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        throw new BadRequestException(
          `File "${file.originalname}" (${formatBytes(file.size)}) exceeds the maximum size limit of ${formatBytes(MAX_FILE_SIZE)}`
        );
      }
    }

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
