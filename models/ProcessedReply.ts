import mongoose from "mongoose";

const processedReplySchema = new mongoose.Schema({
  tweetId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ProcessedReply = mongoose.model("ProcessedReply", processedReplySchema);
