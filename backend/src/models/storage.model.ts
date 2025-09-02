import mongoose, { Model, Schema, Types } from "mongoose";
import { ErrorCodeEnum } from "../enum/error-code.enum";
import type {
  StorageDocument,
  StorageMetrics,
  UploadValidation,
} from "../types/database.types";
import { AppError, NotFoundError } from "../utils/app-error";
import { formatBytes } from "../utils/format-byte";
import FileModel from "./file.model";

/**
 * Storage Model - User Storage Quota Management
 *
 * Manages per-user storage quotas and usage tracking for the file upload system
 * Uses a hybrid approach: metadata in MongoDB, files in AWS S3
 *
 * Features:
 * - 100MB default storage quota per user
 * - Real-time usage calculation from file records
 * - Upload validation before processing
 * - Detailed storage metrics reporting
 *
 * Architecture:
 * - Storage quotas stored in MongoDB
 * - File usage calculated dynamically from FileModel
 * - Validation prevents quota exceeded uploads
 * - Formatted error messages for user feedback
 */

// Default storage quota per user: 100MB
// Can be customized per user by updating their storage document
export const STORAGE_QUOTA = 100 * 1024 * 1024; // 100MB

/**
 * Static methods interface for StorageModel
 * Defines the custom methods available on the model
 */
interface StorageStatics {
  /**
   * Gets comprehensive storage metrics for a user
   * @param userId - The user's ObjectId
   * @returns Storage metrics with quota, usage, and remaining space
   */
  getStorageMetrics(userId: Types.ObjectId): Promise<StorageMetrics>;

  /**
   * Validates if upload is allowed based on storage quota
   * @param userId - The user's ObjectId
   * @param fileSize - Total size of files to upload in bytes
   * @returns Validation result with usage projections
   */
  validateUpload(
    userId: Types.ObjectId,
    fileSize: number
  ): Promise<UploadValidation>;
}

/**
 * Extended model interface combining document and static methods
 */
interface StorageModelType extends Model<StorageDocument>, StorageStatics {}

/**
 * MongoDB schema for user storage quotas
 *
 * Schema structure:
 * - userId: Reference to User document
 * - storageQuota: Maximum allowed storage in bytes (default: 100MB)
 * - createdAt/updatedAt: Automatic timestamps
 *
 * Validation:
 * - Storage quota cannot be negative
 * - User ID is required and must reference existing user
 */
const StorageSchema = new Schema<StorageDocument, StorageModelType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User collection
      required: true,
    },
    storageQuota: {
      // Total storage allowed (in bytes)
      type: Number,
      default: STORAGE_QUOTA, // 100MB default
      min: [0, "Storage quota cannot be negative"],
    },
  },
  {
    timestamps: true, // Automatic createdAt and updatedAt
  }
);

/**
 * Static methods implementation for storage management
 * These methods are called on the model class, not instances
 */
StorageSchema.statics = {
  /**
   * Gets comprehensive storage metrics for a user
   * Combines quota from storage document with real-time usage calculation
   *
   * @param userId - The user's ObjectId
   * @returns Promise resolving to storage metrics
   *
   * @example Usage:
   * ```typescript
   * const metrics = await StorageModel.getStorageMetrics(userId);
   * console.log(`Used: ${metrics.usage} / ${metrics.quota} bytes`);
   * ```
   *
   * @example Result:
   * ```json
   * {
   *   "quota": 2147483648,    // 2GB in bytes
   *   "usage": 1073741824,    // 1GB currently used
   *   "remaining": 1073741824 // 1GB remaining
   * }
   * ```
   */
  async getStorageMetrics(userId: Types.ObjectId) {
    // Get user's storage quota from database
    const storage = await this.findOne({ userId }).lean();
    if (!storage) throw new NotFoundError();

    // Calculate current usage by summing all user's file sizes
    const usage = await FileModel.calculateUsage(userId);

    return {
      quota: storage.storageQuota,
      usage: usage,
      remaining: storage.storageQuota - usage,
    };
  },

  /**
   * Validates if an upload is allowed based on available storage
   * Prevents uploads that would exceed the user's quota
   *
   * @param userId - The user's ObjectId
   * @param totalFileSize - Total size of files to upload in bytes
   * @returns Promise resolving to validation result
   *
   * @throws {AppError} When file size is negative
   * @throws {AppError} When insufficient storage available
   *
   * @example Usage:
   * ```typescript
   * try {
   *   const validation = await StorageModel.validateUpload(userId, 50000000);
   *   console.log('Upload allowed:', validation.allowed);
   * } catch (error) {
   *   console.error('Upload rejected:', error.message);
   * }
   * ```
   *
   * @example Success result:
   * ```json
   * {
   *   "allowed": true,
   *   "newUsage": 1123741824,     // Current usage + new files
   *   "remainingAfterUpload": 1023742024 // Space left after upload
   * }
   * ```
   *
   * @example Error when insufficient storage:
   * "Insufficient storage. 500MB needed."
   */
  async validateUpload(userId: Types.ObjectId, totalFileSize: number) {
    // Validate file size is positive
    if (totalFileSize < 0)
      throw new AppError(
        "File size must be positive",
        ErrorCodeEnum.INVALID_INPUT,
        400
      );

    // Get current storage metrics
    const metrics = await this.getStorageMetrics(userId);
    const hasSpace = metrics.remaining >= totalFileSize;

    // Check if upload would exceed quota
    if (!hasSpace) {
      const shortFall = totalFileSize - metrics.remaining;
      throw new AppError(
        `Insufficient storage. ${formatBytes(shortFall)} needed.`,
        ErrorCodeEnum.INSUFFICIENT_STORAGE,
        400
      );
    }

    // Upload is allowed - return projected usage
    return {
      allowed: true,
      newUsage: metrics.usage + totalFileSize,
      remainingAfterUpload: metrics.remaining - totalFileSize,
    };
  },
};

/**
 * Storage Model Export
 *
 * Usage examples:
 *
 * Create storage record:
 * ```typescript
 * const storage = new StorageModel({
 *   userId: user._id,
 *   storageQuota: 100 * 1024 * 1024 // 100MB
 * });
 * await storage.save();
 * ```
 *
 * Check storage metrics:
 * ```typescript
 * const metrics = await StorageModel.getStorageMetrics(userId);
 * console.log(`${formatBytes(metrics.usage)} / ${formatBytes(metrics.quota)}`);
 * ```
 *
 * Validate upload:
 * ```typescript
 * try {
 *   await StorageModel.validateUpload(userId, fileSize);
 *   // Proceed with upload
 * } catch (error) {
 *   // Handle insufficient storage
 * }
 * ```
 */
const StorageModel = mongoose.model<StorageDocument, StorageModelType>(
  "Storage",
  StorageSchema
);

export default StorageModel;
