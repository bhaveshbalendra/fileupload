"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = void 0;
const get_env_1 = __importDefault(require("../utils/get-env"));
const envConfig = () => ({
    PORT: parseInt((0, get_env_1.default)("PORT", "8000")),
    NODE_ENV: (0, get_env_1.default)("NODE_ENV", "development"),
    LOG_LEVEL: (0, get_env_1.default)("LOG_LEVEL", "info"),
    LOGTAIL_SOURCE_TOKEN: (0, get_env_1.default)("LOGTAIL_SOURCE_TOKEN", ""),
    LOGTAIL_INGESTING_HOST: (0, get_env_1.default)("LOGTAIL_INGESTING_HOST", ""),
    ALLOWED_ORIGIN: (0, get_env_1.default)("ALLOWED_ORIGIN", "*"),
    MONGODB_URI: (0, get_env_1.default)("MONGODB_URI", ""),
    JWT_ACCESS_SECRET: (0, get_env_1.default)("JWT_ACCESS_SECRET", ""),
    JWT_REFRESH_SECRET: (0, get_env_1.default)("JWT_REFRESH_SECRET", ""),
    JWT_ISSUER: (0, get_env_1.default)("JWT_ISSUER", "fileupload"),
    JWT_AUDIENCE: (0, get_env_1.default)("JWT_AUDIENCE", "fileupload.api"),
    ACCESS_TOKEN_TTL: (0, get_env_1.default)("ACCESS_TOKEN_TTL", "15m"),
    REFRESH_TOKEN_TTL: (0, get_env_1.default)("REFRESH_TOKEN_TTL", "7d"),
});
exports.Env = envConfig();
