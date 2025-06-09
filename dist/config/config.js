"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solConnection = exports.RPC_WEBSOCKET_ENDPOINT = exports.RPC_ENDPOINT = exports.CREATOR = exports.X_RAPIDAPI_HOST = exports.X_RAPIDAPI_KEY = exports.TWEETID = exports.JWT_SECRET = exports.PORT = exports.MONGO_URL = void 0;
const web3_js_1 = require("@solana/web3.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
try {
    dotenv_1.default.config();
}
catch (error) {
    console.error("Error loading environment variables:", error);
    process.exit(1);
}
exports.MONGO_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
exports.PORT = process.env.PORT || 9000;
exports.JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
exports.TWEETID = process.env.TWEETID || "TWEET_ID";
exports.X_RAPIDAPI_KEY = process.env.X_RAPIDAPI_KEY || "X_RAPIDAPI_KEY";
exports.X_RAPIDAPI_HOST = process.env.X_RAPIDAPI_HOST || "X_RAPIDAPI_HOST";
exports.CREATOR = process.env.CREATOR || "CREATOR";
exports.RPC_ENDPOINT = process.env.RPC_ENDPOINT || "RPC";
exports.RPC_WEBSOCKET_ENDPOINT = process.env.RPC_WEBSOCKET_ENDPOINT || "WEBSOCKET";
exports.solConnection = new web3_js_1.Connection(exports.RPC_ENDPOINT, {
    wsEndpoint: exports.RPC_WEBSOCKET_ENDPOINT,
});
