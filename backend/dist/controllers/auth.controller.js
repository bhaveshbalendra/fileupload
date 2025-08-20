"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.signup = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const zod_1 = require("zod");
const user_model_1 = __importDefault(require("../models/user.model"));
const session_model_1 = __importDefault(require("../models/session.model"));
const bcrypt_1 = require("../utils/bcrypt");
const app_error_1 = require("../utils/app-error");
const error_code_enum_1 = require("../enum/error-code.enum");
const jwt_1 = require("../utils/jwt");
const env_config_1 = require("../config/env.config");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(100),
});
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(120),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(100),
});
exports.signup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new app_error_1.AppError("Invalid input", error_code_enum_1.ErrorCodeEnum.VALIDATION_ERROR, 400);
    }
    const { name, email, password } = parsed.data;
    const exists = yield user_model_1.default.findOne({ email });
    if (exists) {
        throw new app_error_1.AppError("Email already in use", error_code_enum_1.ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS, 409);
    }
    const user = yield user_model_1.default.create({ name, email, password });
    res.status(201).json({ success: true, user: user.omitPassword() });
}));
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new app_error_1.AppError("Invalid credentials", error_code_enum_1.ErrorCodeEnum.VALIDATION_ERROR, 400);
    }
    const { email, password } = parsed.data;
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new app_error_1.AppError("User not found", error_code_enum_1.ErrorCodeEnum.AUTH_USER_NOT_FOUND, 404);
    }
    const isValid = yield (0, bcrypt_1.compareValue)(password, user.password);
    if (!isValid) {
        throw new app_error_1.AppError("Incorrect email or password", error_code_enum_1.ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS, 401);
    }
    const session = yield session_model_1.default.create({
        userId: user._id,
        userAgent: req.headers["user-agent"] || "",
        ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
        expiresAt: new Date(Date.now() + parseTtlToMs(env_config_1.Env.REFRESH_TOKEN_TTL)),
    });
    const accessToken = (0, jwt_1.signAccessToken)({ sub: String(user._id), sessionId: String(session._id) });
    const refreshToken = (0, jwt_1.signRefreshToken)({ sub: String(user._id), sessionId: String(session._id) });
    setRefreshCookie(res, refreshToken);
    res.status(200).json({ success: true, accessToken, user: user.omitPassword() });
}));
exports.refresh = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = getRefreshCookie(req);
    if (!token) {
        throw new app_error_1.AppError("Refresh token missing", error_code_enum_1.ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND, 401);
    }
    const payload = (0, jwt_1.verifyRefreshToken)(token);
    if (!payload) {
        throw new app_error_1.AppError("Invalid refresh token", error_code_enum_1.ErrorCodeEnum.AUTH_INVALID_TOKEN, 401);
    }
    const session = yield session_model_1.default.findById(payload.sessionId);
    if (!session || session.isRevoked || session.expiresAt.getTime() < Date.now()) {
        throw new app_error_1.AppError("Session expired", error_code_enum_1.ErrorCodeEnum.AUTH_INVALID_TOKEN, 401);
    }
    const newAccess = (0, jwt_1.signAccessToken)({ sub: payload.sub, sessionId: payload.sessionId });
    const newRefresh = (0, jwt_1.signRefreshToken)({ sub: payload.sub, sessionId: payload.sessionId });
    setRefreshCookie(res, newRefresh);
    res.status(200).json({ success: true, accessToken: newAccess });
}));
exports.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = getRefreshCookie(req);
    if (token) {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        if (payload) {
            yield session_model_1.default.findByIdAndUpdate(payload.sessionId, { isRevoked: true });
        }
    }
    clearRefreshCookie(res);
    res.status(200).json({ success: true });
}));
function parseTtlToMs(ttl) {
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match)
        return 0;
    const value = Number(match[1]);
    const unit = match[2];
    switch (unit) {
        case "s":
            return value * 1000;
        case "m":
            return value * 60 * 1000;
        case "h":
            return value * 60 * 60 * 1000;
        case "d":
            return value * 24 * 60 * 60 * 1000;
        default:
            return 0;
    }
}
function setRefreshCookie(res, token) {
    const isProd = env_config_1.Env.NODE_ENV === "production";
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "strict" : "lax",
        maxAge: parseTtlToMs(env_config_1.Env.REFRESH_TOKEN_TTL),
        path: "/auth/refresh",
    });
}
function clearRefreshCookie(res) {
    res.clearCookie("refreshToken", { path: "/auth/refresh" });
}
function getRefreshCookie(req) {
    return (req.cookies && req.cookies.refreshToken) || null;
}
