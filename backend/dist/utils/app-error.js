"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.InternalServerError = exports.AppError = void 0;
const responseMessage_config_1 = __importDefault(require("../config/responseMessage.config"));
const error_code_enum_1 = require("../enum/error-code.enum");
class AppError extends Error {
    constructor(message, errorCode, statusCode, success) {
        super(message);
        this.statusCode = statusCode !== null && statusCode !== void 0 ? statusCode : 500;
        this.errorCode = errorCode;
        this.success = success !== null && success !== void 0 ? success : false;
        this.name = "AppError";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message = responseMessage_config_1.default.NOT_FOUND, success = false) {
        super(message, error_code_enum_1.ErrorCodeEnum.RESOURCE_NOT_FOUND, 404, success);
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends AppError {
    constructor(message = responseMessage_config_1.default.INTERNAL_SERVER_ERROR, success = false) {
        super(message, error_code_enum_1.ErrorCodeEnum.INTERNAL_SERVER_ERROR, 500, success);
    }
}
exports.InternalServerError = InternalServerError;
