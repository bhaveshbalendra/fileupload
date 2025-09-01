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

/**
 * File Upload Middleware using Multer
 * Handles multipart form data parsing with file type validation and memory storage
 * Files are stored in memory as Buffer objects for immediate processing
 *
 * Flow:
 * 1. Parse multipart form data
 * 2. Validate file types against allowed MIME types
 * 3. Store files in memory for processing
 * 4. Attach files to req.files array
 *
 * Security features:
 * - File type validation prevents malicious uploads
 * - Size limits prevent resource exhaustion
 * - Memory storage avoids disk-based attacks
 */

// Configure memory storage - files stored in RAM as Buffer objects
// This allows immediate processing without writing to disk
const storage = multer.memoryStorage();

/**
 * File type validation filter
 * Checks uploaded files against allowed MIME types before processing
 *
 * @param req - Express request object
 * @param file - Multer file object with metadata
 * @param cb - Callback function to accept/reject file
 *
 * @example Allowed types might include:
 * - "image/jpeg", "image/png" for images
 * - "application/pdf" for documents
 * - "text/plain" for text files
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Check if file type is in allowed list
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        `${UPLOAD_ERROR_MESSAGES.INVALID_FILE_TYPE}: ${file.mimetype}`
      )
    );
  }

  // File type is valid - accept it
  cb(null, true);
};

/**
 * Multer configuration for file uploads
 * Combines memory storage, file filtering, and size limits
 *
 * Configuration includes:
 * - Memory storage for immediate processing
 * - File type validation
 * - Size limits per file and total upload
 * - Field name restrictions
 */
const upload = multer({
  storage, // Memory storage configuration
  fileFilter, // File type validation
  ...MULTER_CONFIG, // Size limits and other settings from config
});

/**
 * Multi-file upload middleware
 * Processes multiple files from a single form field with validation
 *
 * Features:
 * - Accepts multiple files in array format
 * - Validates each file type before processing
 * - Stores files in memory for immediate use
 * - Enforces maximum file count limits
 *
 * @example Usage in routes:
 * ```typescript
 * router.post('/upload', multiUpload, (req, res) => {
 *   const files = req.files as Express.Multer.File[];
 *   // Process files array
 * });
 * ```
 *
 * @example Resulting file object structure:
 * ```typescript
 * {
 *   fieldname: 'files',
 *   originalname: 'document.pdf',
 *   encoding: '7bit',
 *   mimetype: 'application/pdf',
 *   buffer: Buffer,
 *   size: 1048576
 * }
 * ```
 */
export const multiUpload = upload.array(FILE_FIELD_NAME, MAX_FILES);
