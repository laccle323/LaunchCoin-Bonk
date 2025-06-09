import { Connection } from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();

try {
  dotenv.config();
} catch (error) {
  console.error("Error loading environment variables:", error);
  process.exit(1);
}

export const MONGO_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
export const PORT = process.env.PORT || 9000
export const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
export const TWEETID = process.env.TWEETID || "TWEET_ID";

export const X_RAPIDAPI_KEY = process.env.X_RAPIDAPI_KEY || "X_RAPIDAPI_KEY";
export const X_RAPIDAPI_HOST = process.env.X_RAPIDAPI_HOST || "X_RAPIDAPI_HOST";

export const CREATOR = process.env.CREATOR || "CREATOR";

export const RPC_ENDPOINT = process.env.RPC_ENDPOINT || "RPC";
export const RPC_WEBSOCKET_ENDPOINT = process.env.RPC_WEBSOCKET_ENDPOINT || "WEBSOCKET";

export const solConnection = new Connection(RPC_ENDPOINT, {
    wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
  })
