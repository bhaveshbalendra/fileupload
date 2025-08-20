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
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("../config/env.config");
const logger_1 = __importDefault(require("./logger"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const DB_URI = env_config_1.Env.MONGODB_URI;
    if (!DB_URI) {
        throw new Error("Database URI is not defined in environment variables.");
    }
    try {
        yield mongoose_1.default.connect(DB_URI);
        logger_1.default.info("MongoDB connected successfully");
    }
    catch (error) {
        logger_1.default.error("MongoDB connection failed", error);
    }
});
exports.connectDB = connectDB;
const disconnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.disconnect();
        logger_1.default.info("MongoDB disconnected successfully");
    }
    catch (error) {
        logger_1.default.error("MongoDB disconnection failed", error);
    }
});
exports.disconnectDB = disconnectDB;
