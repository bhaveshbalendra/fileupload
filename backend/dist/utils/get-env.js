"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnv = (key, defaultValue) => {
    const value = process.env[key];
    if (value === undefined || value === null || value === "") {
        if (defaultValue === "" ||
            defaultValue === undefined ||
            defaultValue === null) {
            throw new Error(`Environment variable ${key} is not set and no default value provided.`);
        }
        return defaultValue;
    }
    return value;
};
exports.default = getEnv;
