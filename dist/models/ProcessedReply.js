"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessedReply = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const processedReplySchema = new mongoose_1.default.Schema({
    tweetId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
exports.ProcessedReply = mongoose_1.default.model("ProcessedReply", processedReplySchema);
