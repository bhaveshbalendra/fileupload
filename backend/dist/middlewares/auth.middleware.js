"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const error_code_enum_1 = require("../enum/error-code.enum");
const app_error_1 = require("../utils/app-error");
const jwt_1 = require("../utils/jwt");
const requireAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : "";
    if (!token) {
        return next(new app_error_1.AppError("Authentication token missing", error_code_enum_1.ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND, 401));
    }
    const payload = (0, jwt_1.verifyAccessToken)(token);
    if (!payload) {
        return next(new app_error_1.AppError("Invalid or expired token", error_code_enum_1.ErrorCodeEnum.AUTH_INVALID_TOKEN, 401));
    }
    req.user = { id: payload.sub, role: payload.role, sessionId: payload.sessionId };
    return next();
};
exports.requireAuth = requireAuth;
