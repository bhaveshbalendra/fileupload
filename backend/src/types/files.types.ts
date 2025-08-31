// File operation request types
export interface DeleteFilesRequest {
  fileIds: string[];
}

export interface DownloadFilesRequest {
  fileIds: string[];
}

// File query types
export interface GetAllFilesQuery {
  keyword?: string;
  pageSize?: string;
  pageNumber?: string;
}

// File service types
export interface FileFilter {
  keyword?: string;
}

export interface FilePagination {
  pageSize: number;
  pageNumber: number;
}

// Upload configuration types
export interface UploadConfig {
  maxFileSize: number;
  maxFiles: number;
  allowedMimeTypes: string[];
  fieldName: string;
  storageType: string;
}

// Upload error types
export interface UploadErrorMessages {
  INVALID_FILE_TYPE: string;
  FILE_TOO_LARGE: string;
  TOO_MANY_FILES: string;
}

// Multer configuration types
export interface MulterConfig {
  limits: {
    files: number;
    fileSize: number;
  };
  preservePath: boolean;
}
