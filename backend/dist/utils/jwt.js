"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const commonSignOptions = {
    issuer: env_config_1.Env.JWT_ISSUER,
    audience: env_config_1.Env.JWT_AUDIENCE,
};
const signAccessToken = (payload) => {
    const options = Object.assign(Object.assign({}, commonSignOptions), { expiresIn: env_config_1.Env.ACCESS_TOKEN_TTL });
    return jsonwebtoken_1.default.sign(payload, env_config_1.Env.JWT_ACCESS_SECRET, options);
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => {
    const options = Object.assign(Object.assign({}, commonSignOptions), { expiresIn: env_config_1.Env.REFRESH_TOKEN_TTL });
    return jsonwebtoken_1.default.sign(payload, env_config_1.Env.JWT_REFRESH_SECRET, options);
};
exports.signRefreshToken = signRefreshToken;
const verifyAccessToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_config_1.Env.JWT_ACCESS_SECRET, {
            issuer: env_config_1.Env.JWT_ISSUER,
            audience: env_config_1.Env.JWT_AUDIENCE,
        });
        return decoded;
    }
    catch (_a) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_config_1.Env.JWT_REFRESH_SECRET, {
            issuer: env_config_1.Env.JWT_ISSUER,
            audience: env_config_1.Env.JWT_AUDIENCE,
        });
        return decoded;
    }
    catch (_a) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
