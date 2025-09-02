// File upload configuration
export const MAX_FILE_SIZE = 200 * 1024; // 200KB per file
export const MAX_FILES = 10; // per request

// Storage configuration
export const STORAGE_TYPE = "memory"; // "memory" | "disk"

// Field name for file uploads
export const FILE_FIELD_NAME = "files";

// Error messages
export const UPLOAD_ERROR_MESSAGES = {
  INVALID_FILE_TYPE: "File type not allowed",
  FILE_TOO_LARGE: "File size exceeds maximum limit of 200KB",
  TOO_MANY_FILES: "Too many files uploaded",
  STORAGE_QUOTA_EXCEEDED: "Upload would exceed your 100MB storage limit",
} as const;

// Allowed MIME types
export const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",

  // Documents
  "application/pdf", // PDF files
  "application/msword", // .doc files
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx files

  // Text files
  "text/plain",
  "text/csv",

  // Archives
  "application/zip",
  "application/x-zip-compressed",
  "application/x-tar",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx

  // Audio
  "audio/wav",
  "audio/webm",

  // Video
  "video/mp4",
  "video/webm",
];

// Multer configuration object
export const MULTER_CONFIG = {
  limits: {
    files: MAX_FILES,
    fileSize: MAX_FILE_SIZE,
  },
  preservePath: false,
} as const;
