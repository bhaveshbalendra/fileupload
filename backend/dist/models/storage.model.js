"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.STORAGE_QUOTA = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const file_model_1 = __importDefault(require("./file.model"));
const app_error_1 = require("../utils/app-error");
const format_byte_1 = require("../utils/format-byte");
const error_code_enum_1 = require("../enum/error-code.enum");
exports.STORAGE_QUOTA = 2 * 1024 * 1024 * 1024;
const StorageSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    storageQuota: {
        type: Number,
        default: exports.STORAGE_QUOTA,
        min: [0, 'Storage quota cannot be negative'],
    },
}, {
    timestamps: true,
});
StorageSchema.statics = {
    getStorageMetrics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const storage = yield this.findOne({ userId }).lean();
            if (!storage)
                throw new app_error_1.NotFoundError();
            const usage = yield file_model_1.default.calculateUsage(userId);
            return {
                quota: storage.storageQuota,
                usage: usage,
                remaining: storage.storageQuota - usage,
            };
        });
    },
    validateUpload(userId, totalFileSize) {
        return __awaiter(this, void 0, void 0, function* () {
            if (totalFileSize < 0)
                throw new app_error_1.AppError('File size must be positive', error_code_enum_1.ErrorCodeEnum.INVALID_INPUT, 400);
            const metrics = yield this.getStorageMetrics(userId);
            const hasSpace = metrics.remaining >= totalFileSize;
            if (!hasSpace) {
                const shortFall = totalFileSize - metrics.remaining;
                throw new app_error_1.AppError(`Insufficient storage. ${(0, format_byte_1.formatBytes)(shortFall)} needed.`, error_code_enum_1.ErrorCodeEnum.INSUFFICIENT_STORAGE, 400);
            }
            return {
                allowed: true,
                newUsage: metrics.usage + totalFileSize,
                remainingAfterUpload: metrics.remaining - totalFileSize,
            };
        });
    },
};
const StorageModel = mongoose_1.default.model('Storage', StorageSchema);
exports.default = StorageModel;
