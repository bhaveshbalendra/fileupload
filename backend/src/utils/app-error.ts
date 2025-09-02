import { ErrorCodeEnum, ErrorCodeEnumType } from "../enum/error-code.enum";

/**
 * @class AppError
 * @extends Error
 * @description Base class for all application errors
 */
class AppError extends Error {
  public name: string;
  public statusCode: number;
  public errorCode: ErrorCodeEnumType;
  public success: boolean;

  constructor(
    message: string,
    errorCode: ErrorCodeEnumType,
    statusCode?: number,
    success?: boolean
  ) {
    super(message);
    this.statusCode = statusCode ?? 500;
    this.errorCode = errorCode;
    this.success = success ?? false;
    this.name = "AppError";
    
    // Only capture stack trace in development
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error()).stack;
    }
  }
}

/**
 * @class NotFound
 * @extends AppError
 * @description Error class for resource not found errors
 */
class NotFoundError extends AppError {
  constructor(
    message: string = ErrorCodeEnum.RESOURCE_NOT_FOUND,
    success = false
  ) {
    // Call the parent constructor with the appropriate parameters
    super(message, ErrorCodeEnum.RESOURCE_NOT_FOUND, 404, success);
  }
}

/**
 * @class InternalServerError
 * @extends AppError
 * @description Error class for internal server errors
 */
class InternalServerError extends AppError {
  constructor(
    message: string = ErrorCodeEnum.INTERNAL_SERVER_ERROR,
    success = false
  ) {
    // Call the parent constructor with the appropriate parameters
    super(message, ErrorCodeEnum.INTERNAL_SERVER_ERROR, 500, success);
  }
}

/**
 * @class BadRequestException
 * @extends AppError
 * @description Error class for bad request errors
 */
class BadRequestException extends AppError {
  constructor(message: string = ErrorCodeEnum.BAD_REQUEST, success = false) {
    // Call the parent constructor with the appropriate parameters
    super(message, ErrorCodeEnum.BAD_REQUEST, 400, success);
  }
}

/**
 * @class UnauthorizedException
 * @extends AppError
 * @description Error class for unauthorized access errors
 */
class UnauthorizedException extends AppError {
  constructor(message: string = ErrorCodeEnum.UNAUTHORIZED, success = false) {
    // Call the parent constructor with the appropriate parameters
    super(message, ErrorCodeEnum.UNAUTHORIZED, 401, success);
  }
}

class TooManyRequestsError extends AppError {
  constructor(
    message: string = ErrorCodeEnum.TOO_MANY_REQUESTS,
    success = false
  ) {
    // Call the parent constructor with the appropriate parameters
    super(message, ErrorCodeEnum.TOO_MANY_REQUESTS, 429, success);
  }
}

export {
  AppError,
  BadRequestException,
  InternalServerError,
  NotFoundError,
  UnauthorizedException,
  TooManyRequestsError,
};