import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as path from "path";
import { PassThrough, Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../config/aws-s3.config";
import { Env } from "../config/env.config";
import FileModel from "../models/file.model";
import UserModel from "../models/user.model";
import { UploadSourceEnum } from "../types/database.types";
import {
  BadRequestException,
  InternalServerError,
  NotFoundError,
  UnauthorizedException,
} from "../utils/app-error";
import { sanitizeFilename } from "../utils/helper";
import logger from "../utils/logger";
import archiver = require("archiver");
import { Express } from "express";

/**
 * Uploads multiple files to AWS S3 and saves metadata to MongoDB
 * Processes files in parallel and handles partial failures gracefully
 *
 * @param userId - The authenticated user's ID
 * @param files - Array of files processed by multer middleware
 * @param uploadedVia - Source of upload (WEB or API)
 * @returns Upload results with successful and failed file counts
 *
 * @example Result:
 * {
 *   message: "Uploaded successfully 2 out of 3 files",
 *   data: [
 *     {
 *       fileId: "64a1b2c3d4e5f6789abcdef0",
 *       originalName: "document.pdf",
 *       size: 1048576,
 *       ext: "pdf",
 *       mimeType: "application/pdf"
 *     }
 *   ],
 *   failedCount: 1
 * }
 */
export const uploadFilesService = async (
  userId: string,
  files: Express.Multer.File[],
  uploadedVia: keyof typeof UploadSourceEnum
) => {
  // Verify user exists in database before processing files
  const user = await UserModel.findOne({ _id: userId });
  if (!user) throw new UnauthorizedException("Unauthorized access");
  if (!files?.length) throw new BadRequestException("No files provided");

  // Process all files in parallel using Promise.allSettled to handle partial failures
  // This ensures one failed file doesn't stop others from uploading
  const results = await Promise.allSettled(
    files.map(async (file) => {
      let _storageKey: string | null = null;
      try {
        // Step 1: Upload file buffer to AWS S3 with unique storage key
        const { storageKey } = await uploadToS3(file, userId);
        _storageKey = storageKey;

        // Step 2: Save file metadata to MongoDB for tracking and management
        const createdFile = await FileModel.create({
          userId,
          storageKey, // S3 path: users/{userId}/{uuid}-{filename}.ext
          originalName: file.originalname,
          uploadVia: uploadedVia,
          size: file.size,
          ext: path.extname(file.originalname)?.slice(1)?.toLowerCase(),
          url: "", // Will be generated on-demand via signed URLs
          mimeType: file.mimetype,
        });

        // Step 3: Return essential file information for response
        return {
          fileId: createdFile._id,
          originalName: createdFile.originalName,
          size: createdFile.size,
          ext: createdFile.ext,
          mimeType: createdFile.mimeType,
        };
      } catch (error) {
        logger.error("Error uploading file", error);
        // TODO: Cleanup - delete from S3 bucket if database save fails
        if (_storageKey) {
          // Should implement S3 cleanup here to prevent orphaned files
        }
        throw error;
      }
    })
  );

  // Separate successful uploads from failed ones
  const successfulRes = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  const failedRes = results
    .filter((r) => r.status === "rejected")
    .map((r) => r.reason.message);

  // Log warnings for failed uploads but don't throw error (partial success allowed)
  if (failedRes.length > 0) {
    logger.warn("Failed to upload files", files);
    // Note: We allow partial failures - some files can succeed while others fail
  }

  // Return comprehensive upload summary
  return {
    message: `Uploaded successfully ${successfulRes.length} out of ${files.length} files`,
    data: successfulRes, // Array of successfully uploaded file info
    failedCount: failedRes.length,
  };
};

/**
 * Retrieves paginated list of user's files with search functionality
 * Generates signed URLs for secure file access
 *
 * @param userId - The authenticated user's ID
 * @param filter - Search filters (keyword for filename search)
 * @param pagination - Page size and page number for pagination
 * @returns Paginated file list with signed URLs
 *
 * @example Result:
 * {
 *   files: [
 *     {
 *       _id: "64a1b2c3d4e5f6789abcdef0",
 *       originalName: "document.pdf",
 *       size: 1048576,
 *       url: "https://bucket.s3.amazonaws.com/path?signature=...",
 *       mimeType: "application/pdf"
 *     }
 *   ],
 *   pagination: {
 *     pageSize: 20,
 *     pageNumber: 1,
 *     totalCount: 45,
 *     totalPages: 3
 *   }
 * }
 */
export const getAllFilesService = async (
  userId: string,
  filter: {
    keyword?: string;
  },
  pagination: { pageSize: number; pageNumber: number }
) => {
  const { keyword } = filter;

  // Build MongoDB query conditions
  const filterConditons: Record<string, any> = {
    userId, // Only user's own files
  };

  // Add case-insensitive filename search if keyword provided
  if (keyword) {
    filterConditons.$or = [
      {
        originalName: {
          $regex: keyword, // Partial match search
          $options: "i", // Case insensitive
        },
      },
    ];
  }

  // Calculate pagination parameters
  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  // Execute file query and count in parallel for better performance
  const [files, totalCount] = await Promise.all([
    FileModel.find(filterConditons)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }), // Newest files first
    FileModel.countDocuments(filterConditons), // Total matching files
  ]);

  // Generate signed URLs for secure file access (parallel processing)
  const filesWithUrls = await Promise.all(
    files.map(async (file) => {
      // Create temporary signed URL for file access (1 hour expiration)
      const url = await getFileFromS3({
        storageKey: file.storageKey,
        mimeType: file.mimeType,
        expiresIn: 3600, // URL expires in 1 hour for security
      });

      return {
        ...file.toObject(),
        url, // Signed URL for secure access
        storageKey: undefined, // Remove internal storage key from response
      };
    })
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    files: filesWithUrls,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

/**
 * Retrieves a single file as a stream for direct serving
 * Used for public file access without requiring authentication
 *
 * @param fileId - The file ID to retrieve
 * @returns Stream and metadata for file serving
 *
 * @example Result:
 * {
 *   url: "", // Empty - using stream instead
 *   stream: ReadableStream,
 *   contentType: "application/pdf",
 *   fileSize: 1048576
 * }
 */
export const getFileUrlService = async (fileId: string) => {
  // Find file metadata in database
  const file = await FileModel.findOne({ _id: fileId });
  if (!file) throw new NotFoundError("File not found");

  // Get file as readable stream for direct serving (better for large files)
  const stream = await getS3ReadStream(file.storageKey);

  // Alternative: Use signed URL instead of stream
  // const url = await getFileFromS3({
  //   storageKey: file.storageKey,
  //   mimeType: file.mimeType,
  //   expiresIn: 3600,
  // });

  return {
    url: "", // Using stream instead of URL
    stream, // Direct file stream for serving
    contentType: file.mimeType,
    fileSize: file.size,
  };
};

/**
 * Deletes multiple files from both S3 and MongoDB
 * Handles partial failures gracefully - continues even if some S3 deletions fail
 *
 * @param userId - The authenticated user's ID
 * @param fileIds - Array of file IDs to delete
 * @returns Deletion summary with success and failure counts
 *
 * @example Result:
 * {
 *   deletedCount: 3,
 *   failedCount: 1
 * }
 */
export const deleteFilesService = async (userId: string, fileIds: string[]) => {
  const files = await FileModel.find({
    _id: { $in: fileIds },
  });
  if (!files.length) throw new NotFoundError("No files found");

  const s3Errors: string[] = [];

  await Promise.all(
    files.map(async (file) => {
      try {
        await deleteFromS3(file.storageKey);
      } catch (error) {
        logger.error(`Failed to delete ${file.storageKey} from s3`, error);
        s3Errors.push(file.storageKey);
      }
    })
  );

  const successfulFileIds = files
    .filter((file) => !s3Errors.includes(file.storageKey))
    .map((file) => file._id);

  const { deletedCount } = await FileModel.deleteMany({
    _id: { $in: successfulFileIds },
    userId,
  });

  if (s3Errors.length > 0) {
    logger.warn(`Failed to delete ${s3Errors.length} files form S3`);
  }

  return {
    deletedCount,
    failedCount: s3Errors.length,
  };
};

/**
 * Generates download URLs for files - single file or ZIP for multiple
 * Creates temporary ZIP file in S3 for multiple file downloads
 *
 * @param userId - The authenticated user's ID
 * @param fileIds - Array of file IDs to download
 * @returns Download URL and ZIP indicator
 *
 * @example Single file result:
 * {
 *   url: "https://bucket.s3.amazonaws.com/path?signature=...",
 *   isZip: false
 * }
 *
 * @example Multiple files result:
 * {
 *   url: "https://bucket.s3.amazonaws.com/temp-zips/userId/timestamp.zip?signature=...",
 *   isZip: true
 * }
 */
export const downloadFilesService = async (
  userId: string,
  fileIds: string[]
) => {
  const files = await FileModel.find({
    _id: { $in: fileIds },
  });
  if (!files.length) throw new NotFoundError("No files found");

  if (files.length === 1) {
    const signedUrl = await getFileFromS3({
      storageKey: files[0].storageKey,
      filename: files[0].originalName,
    });

    return {
      url: signedUrl,
      isZip: false,
    };
  }

  const url = await handleMultipleFilesDownload(files, userId);

  return {
    url,
    isZip: true,
  };
};

/**
 * Creates a ZIP file containing multiple files and uploads it to S3
 * Used for bulk downloads - creates temporary ZIP file with expiring download link
 *
 * @param files - Array of file metadata with storage keys and names
 * @param userId - User ID for organizing temp files
 * @returns Signed URL for ZIP file download
 *
 * @example ZIP naming:
 * - S3 key: "temp-zips/userId/1640995200000.zip"
 * - Download name: "uploadnest-1640995200000.zip"
 */
async function handleMultipleFilesDownload(
  files: Array<{ storageKey: string; originalName: string }>,
  userId: string
) {
  const timestamp = Date.now();

  // Generate unique paths for temporary ZIP file
  const zipKey = `temp-zips/${userId}/${timestamp}.zip`; // S3 storage path
  const zipFilename = `uploadnest-${timestamp}.zip`; // Download filename

  // Create ZIP archive with compression level 6 (balanced speed/size)
  const zip = archiver("zip", { zlib: { level: 6 } });

  // Create pass-through stream for uploading ZIP to S3 while creating it
  const passThrough = new PassThrough();

  // Handle archiver errors
  zip.on("error", (err: any) => {
    passThrough.destroy(err);
  });

  // Set up S3 upload while ZIP is being created (streaming upload)
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: Env.AWS_S3_BUCKET!,
      Key: zipKey,
      Body: passThrough, // Stream ZIP data directly to S3
      ContentType: "application/zip",
    },
  });

  // Connect ZIP output to S3 upload stream
  zip.pipe(passThrough);

  // Add each file to ZIP archive
  for (const file of files) {
    try {
      // Get file stream from S3
      const stream = await getS3ReadStream(file.storageKey);
      // Add to ZIP with sanitized filename
      zip.append(stream, { name: sanitizeFilename(file.originalName) });
    } catch (error: any) {
      zip.destroy(error);
      throw error;
    }
  }

  // Finalize ZIP creation and wait for S3 upload to complete
  await zip.finalize();
  await upload.done();

  // Generate signed URL for ZIP download (1 hour expiration)
  const url = await getFileFromS3({
    storageKey: zipKey,
    filename: zipFilename,
    expiresIn: 3600,
  });

  return url;
}

/**
 * Uploads a single file to AWS S3 with organized folder structure
 * Generates unique storage key to prevent filename conflicts
 *
 * @param file - Multer file object containing buffer and metadata
 * @param userId - User ID for organizing files in S3
 * @param meta - Optional metadata to attach to S3 object
 * @returns Object containing the S3 storage key
 *
 * @example Storage key format:
 * "users/64a1b2c3d4e5f6789abcdef0/550e8400-e29b-41d4-a716-446655440000-document.pdf"
 */
async function uploadToS3(
  file: Express.Multer.File,
  userId: string,
  meta?: Record<string, string>
) {
  try {
    // Extract and sanitize filename components
    const ext = path.extname(file.originalname); // .pdf, .jpg, etc.
    const basename = path.basename(file.originalname, ext); // filename without extension

    // Clean filename and limit length to prevent issues
    const cleanName = sanitizeFilename(basename).substring(0, 64);

    logger.info(sanitizeFilename(basename), cleanName);

    // Create unique storage key: users/{userId}/{uuid}-{filename}.ext
    const storageKey = `users/${userId}/${uuidv4()}-${cleanName}${ext}`;

    // Create S3 upload command
    const command = new PutObjectCommand({
      Bucket: Env.AWS_S3_BUCKET!, // S3 bucket name from environment
      Key: storageKey, // Unique file path in S3
      Body: file.buffer, // File content from multer (stored in memory)
      ...(meta && { Metadata: meta }), // Optional custom metadata
    });

    // Execute upload to S3
    await s3.send(command);

    // Note: We don't return direct URL here for security
    // URLs are generated on-demand using signed URLs with expiration

    return {
      storageKey, // S3 path for internal reference
    };
  } catch (error) {
    logger.error("AWS Error Failed upload", error);
    throw error;
  }
}

/**
 * Generates a signed URL for secure file access from S3
 * URLs expire after specified time for security
 *
 * @param params - Configuration for URL generation
 * @param params.storageKey - S3 object key
 * @param params.filename - Optional download filename
 * @param params.mimeType - File MIME type for inline display
 * @param params.expiresIn - URL expiration in seconds (default: 60)
 * @returns Signed URL for temporary file access
 */
async function getFileFromS3({
  storageKey,
  filename,
  mimeType,
  expiresIn = 60,
}: {
  storageKey: string;
  expiresIn?: number;
  filename?: string;
  mimeType?: string;
}) {
  try {
    const command = new GetObjectCommand({
      Bucket: Env.AWS_S3_BUCKET!,
      Key: storageKey,
      // For inline display (images, PDFs) - no filename specified
      ...(!filename && {
        ResponseContentType: mimeType,
        ResponseContentDisposition: `inline`, // Display in browser
      }),
      // For downloads - filename specified
      ...(filename && {
        ResponseContentDisposition: `attachment;filename="${filename}"`,
      }),
    });

    // Generate signed URL with expiration
    return await getSignedUrl(s3, command, { expiresIn });
  } catch (error) {
    logger.error(`Failed to get file from S3: ${storageKey}`);
    throw error;
  }
}

/**
 * Gets a readable stream for a file from S3
 * Used for streaming large files directly to client
 *
 * @param storageKey - S3 object key
 * @returns Readable stream of file content
 */
async function getS3ReadStream(storageKey: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: Env.AWS_S3_BUCKET!,
      Key: storageKey,
    });

    const response = await s3.send(command);

    if (!response.Body) {
      logger.error(`No body returned for key: ${storageKey}`);
      throw new InternalServerError(`No body returned for key`);
    }

    // Return readable stream for file content
    return response.Body as Readable;
  } catch (error) {
    logger.error(`Error getting s3 stream for key: ${storageKey}`);
    throw new InternalServerError(`Failed to retrieve file`);
  }
}

/**
 * Deletes a file from S3 bucket
 * Used during file deletion or cleanup operations
 *
 * @param storageKey - S3 object key to delete
 */
async function deleteFromS3(storageKey: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: Env.AWS_S3_BUCKET!,
      Key: storageKey,
    });

    await s3.send(command);
  } catch (error) {
    logger.error(`Failed to delete file from S3`, storageKey);
    throw error;
  }
}
