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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const config_1 = require("./config");
const getReplies_1 = require("./utils/getReplies");
const createMint_1 = require("./launchpad/createMint");
const ProcessedReply_1 = require("./models/ProcessedReply");
const fileUpload_1 = require("./utils/fileUpload");
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
(0, config_1.connectMongoDB)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "./public")));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
// Route
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Backend Server is Running now!");
}));
server.listen(config_1.PORT, () => {
    console.log(`Server is running on port ${config_1.PORT}`);
});
// ---------------------------
// Core Tweet Processor Logic
// ---------------------------
function processTweetReplies() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const tweetId = config_1.TWEETID;
            const response = yield (0, getReplies_1.fetchTweetReplies)(tweetId);
            const replies = JSON.parse(response);
            // console.log("🚀 ~ processTweetReplies ~ replies:", replies)
            if (!replies ||
                !Array.isArray(replies.replies) ||
                replies.replies.length === 0) {
                console.log("ℹ️ No replies found or replies data is invalid.");
                return;
            }
            console.log("📥 Total replies fetched:", replies.replies.length);
            for (let i = 0; i < replies.replies.length; i++) {
                const reply = replies.replies[i];
                // Check if already processed
                const alreadyProcessed = yield ProcessedReply_1.ProcessedReply.findOne({
                    tweetId: reply.tweet_id
                });
                if (alreadyProcessed) {
                    console.log(`⏭️ Reply #${i + 1} already processed. Skipping.`);
                    continue;
                }
                const inputString = reply.text;
                const words = inputString.split(" ");
                console.log("🚀 ~ processTweetReplies ~ words:", words);
                if (!words.includes("@itsbonked")) {
                    console.log(`❌ @itsbonked not found in reply #${i + 1}. Skipping.`);
                    continue;
                }
                let symbol = null;
                let name = null;
                let image = "https://letsbonk.fun/logos/bonk_fun.png";
                for (let j = 0; j < words.length; j++) {
                    if (words[j].startsWith("$")) {
                        symbol = words[j];
                        name = words[j + 2] || null;
                        break;
                    }
                }
                if (!symbol || !name) {
                    console.log(`⚠️ Missing symbol or name in reply #${i + 1}. Skipping.`);
                    continue;
                }
                if ((_a = reply.media_url) === null || _a === void 0 ? void 0 : _a[0])
                    image = reply.media_url[0];
                console.log(`✅ Processing Reply #${i + 1}`);
                console.log("  Symbol:", symbol);
                console.log("  Name:", name);
                console.log("  Image:", image);
                const uploadedImage = yield (0, fileUpload_1.uploadImage)(image);
                const jsonData = {
                    name: name,
                    symbol: symbol,
                    image: uploadedImage,
                    description: "@itsbonked created this token on letsbonk.fun",
                    createdOn: "https://bonk.fun"
                };
                const uploadMetadataUrl = yield (0, fileUpload_1.uploadMetadata)(jsonData);
                console.log("🚀 ~ processTweetReplies ~ uploadMetadataUrl:", uploadMetadataUrl);
                const fetchUri = yield fetch(uploadMetadataUrl);
                const resText = yield fetchUri.text();
                const data = JSON.parse(resText);
                console.log("🚀 ~ processTweetReplies ~ data:", data);
                if (!uploadMetadataUrl) {
                    console.log("Metadata upload failed.");
                    return;
                }
                try {
                    const res = yield (0, createMint_1.createMint)(data.name, data.symbol, data.image);
                    yield delay(1500);
                    const targetId = reply.tweet_id;
                    const content = `Your coin ${name}(${symbol} is live! Link: letsbonk.fun)`;
                    // await replyToTweet({target_id: targetId, content: content});
                }
                catch (error) {
                    console.log("Create mint Error: ", error);
                }
                // Mark as processed
                yield ProcessedReply_1.ProcessedReply.create({ tweetId: reply.tweet_id });
            }
        }
        catch (error) {
            console.error("❌ Error processing replies:", error);
        }
    });
}
// --------------------------------
// Interval: Run every 5 minutes
// --------------------------------
const INTERVAL_MS = 1 * 60 * 1000; // 5 minutes
// Initial run
processTweetReplies();
// Re-run at interval
setInterval(() => {
    console.log("⏱️ Checking for new tweet replies...");
    processTweetReplies();
}, INTERVAL_MS);
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
