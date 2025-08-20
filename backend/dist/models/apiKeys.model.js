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
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const ApiKeySchema = new mongoose_2.Schema({
    userId: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true },
    displayKey: { type: String, required: true },
    hashedKey: { type: String, required: true, select: false },
    lastUsedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
ApiKeySchema.statics.updateLastUsedAt = function (hashedKey) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.updateOne({ hashedKey }, { lastUsedAt: new Date() });
    });
};
const ApiKeyModel = mongoose_1.default.model('ApiKey', ApiKeySchema);
exports.default = ApiKeyModel;
