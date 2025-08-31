import { Types } from "mongoose";

// User-related types
export interface UserDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(value: string): Promise<boolean>;
  omitPassword(): Omit<UserDocument, "password">;
}

// File upload types
export enum UploadSourceEnum {
  WEB = "WEB",
  API = "API",
}

export interface FileDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  formattedSize: string;
  ext: string;
  uploadVia: keyof typeof UploadSourceEnum;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

// Upload result types
export interface UploadResult {
  fileId: string;
  originalName: string;
  size: number;
  ext: string;
  mimeType: string;
}

// Download types
export interface DownloadResult {
  url: string;
  isZip?: boolean;
}

// Storage types
export interface StorageDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  storageQuota: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageMetrics {
  quota: number;
  usage: number;
  remaining: number;
}

export interface UploadValidation {
  allowed: boolean;
  newUsage: number;
  remainingAfterUpload: number;
}

// Session types
export interface SessionDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userAgent: string;
  ipAddress: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Key types
export interface ApiKeyDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  displayKey: string;
  hashedKey: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
}
