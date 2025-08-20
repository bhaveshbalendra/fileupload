"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_config_1 = require("../config/env.config");
const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    const errorCode = error.errorCode || "INTERNAL_SERVER_ERROR";
    const success = error.success || false;
    if (env_config_1.Env.NODE_ENV === "development") {
        console.error("Error details:", error);
    }
    if (error.name === "AppError") {
        res.status(statusCode).json({
            statusCode,
            message,
            errorCode,
            success,
        });
    }
    return;
};
exports.errorHandler = errorHandler;
