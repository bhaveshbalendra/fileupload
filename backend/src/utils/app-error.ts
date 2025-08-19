import ResponseMessages from "../config/responseMessage.config";
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
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * @class NotFound
 * @extends AppError
 * @description Error class for resource not found errors
 */
class NotFoundError extends AppError {
  constructor(message = ResponseMessages.NOT_FOUND, success = false) {
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
    message = ResponseMessages.INTERNAL_SERVER_ERROR,
    success = false
  ) {
    // Call the parent constructor with the appropriate parameters
    super(message, ErrorCodeEnum.INTERNAL_SERVER_ERROR, 500, success);
  }
}

export { AppError, InternalServerError, NotFoundError };
