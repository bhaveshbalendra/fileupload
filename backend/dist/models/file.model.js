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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadSourceEnum = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const format_byte_1 = require("../utils/format-byte");
var UploadSourceEnum;
(function (UploadSourceEnum) {
    UploadSourceEnum["WEB"] = "WEB";
    UploadSourceEnum["API"] = "API";
})(UploadSourceEnum || (exports.UploadSourceEnum = UploadSourceEnum = {}));
const FileSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    storageKey: {
        type: String,
        required: true,
        unique: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
        min: 1,
    },
    ext: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: false,
    },
    uploadVia: {
        type: String,
        enum: Object.keys(UploadSourceEnum),
        required: true,
    },
}, {
    timestamps: true,
    toObject: {
        transform: (doc, ret) => {
            ret.formattedSize = (0, format_byte_1.formatBytes)(ret.size);
            return ret;
        },
    },
    toJSON: {
        transform: (doc, ret) => {
            ret.formattedSize = (0, format_byte_1.formatBytes)(ret.size);
            return ret;
        },
    },
});
FileSchema.statics.calculateUsage = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const result = yield this.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: null,
                    totalSize: {
                        $sum: '$size',
                    },
                },
            },
        ]);
        return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalSize) || 0;
    });
};
FileSchema.index({ userId: 1 });
FileSchema.index({ createdAt: -1 });
const FileModel = mongoose_1.default.model('File', FileSchema);
exports.default = FileModel;
