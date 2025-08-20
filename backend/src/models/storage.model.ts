import mongoose, { Model, Schema, Types } from "mongoose";
import { ErrorCodeEnum } from "../enum/error-code.enum";
import { AppError, NotFoundError } from "../utils/app-error";
import { formatBytes } from "../utils/format-byte";
import FileModel from "./file.model";

export const STORAGE_QUOTA = 2 * 1024 * 1024 * 1024; //2GB

interface IStorage {
  userId: Types.ObjectId;
  storageQuota: number;
  createdAt: Date;
  updatedAt: Date;
}

interface StorgeMetrics {
  quota: number;
  usage: number;
  remaining: number;
}

interface UploadValidation {
  allowed: boolean;
  newUsage: number;
  remainingAfterUpload: number;
}

interface StorageStatics {
  getStorageMetrics(userId: Types.ObjectId): Promise<StorgeMetrics>;
  validateUpload(
    userId: Types.ObjectId,
    fileSize: number
  ): Promise<UploadValidation>;
}

interface StorageDocument extends IStorage, Document {}

interface StorageModelType extends Model<StorageDocument>, StorageStatics {}

const StorageSchema = new Schema<StorageDocument, StorageModelType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storageQuota: {
      type: Number,
      default: STORAGE_QUOTA,
      min: [0, "Storage quota cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

StorageSchema.statics = {
  async getStorageMetrics(userId: Types.ObjectId) {
    const storage = await this.findOne({ userId }).lean();
    if (!storage) throw new NotFoundError();
    const usage = await FileModel.calculateUsage(userId);
    return {
      quota: storage.storageQuota,
      usage: usage,
      remaining: storage.storageQuota - usage,
    };
  },

  async validateUpload(userId: Types.ObjectId, totalFileSize: number) {
    if (totalFileSize < 0)
      throw new AppError(
        "File size must be positive",
        ErrorCodeEnum.INVALID_INPUT,
        400
      );

    const metrics = await this.getStorageMetrics(userId);
    const hasSpace = metrics.remaining >= totalFileSize;

    if (!hasSpace) {
      const shortFall = totalFileSize - metrics.remaining;
      throw new AppError(
        `Insufficient storage. ${formatBytes(shortFall)} needed.`,
        ErrorCodeEnum.INSUFFICIENT_STORAGE,
        400
      );
    }

    return {
      allowed: true,
      newUsage: metrics.usage + totalFileSize,
      remainingAfterUpload: metrics.remaining - totalFileSize,
    };
  },
};

const StorageModel = mongoose.model<StorageDocument, StorageModelType>(
  "Storage",
  StorageSchema
);

export default StorageModel;
