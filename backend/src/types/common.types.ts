// Common API response types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  success: boolean;
}

// Common pagination types
export interface PaginationParams {
  pageSize: number;
  pageNumber: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

// Common filter types
export interface FilterParams {
  keyword?: string;
}

// Common error types
export interface ErrorResponse {
  message: string;
  code: string;
  statusCode: number;
}
