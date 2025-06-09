import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import http from "http";

import { PORT, connectMongoDB, TWEETID } from "./config";
import { fetchTweetReplies } from "./utils/getReplies";
import { createMint } from "./launchpad/createMint";
import { ProcessedReply } from "./models/ProcessedReply";
import { metadataInfo } from "./utils/types";
import { uploadMetadata, uploadImage } from "./utils/fileUpload";
import { replyToTweet } from "./utils/replyTweet";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectMongoDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Route
app.get("/", async (req, res) => {
  res.send("Backend Server is Running now!");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ---------------------------
// Core Tweet Processor Logic
// ---------------------------

async function processTweetReplies() {
  try {
    const tweetId = TWEETID;
    const response = await fetchTweetReplies(tweetId);
    const replies = JSON.parse(response);
    // console.log("🚀 ~ processTweetReplies ~ replies:", replies)

    if (
      !replies ||
      !Array.isArray(replies.replies) ||
      replies.replies.length === 0
    ) {
      console.log("ℹ️ No replies found or replies data is invalid.");
      return;
    }

    console.log("📥 Total replies fetched:", replies.replies.length);

    for (let i = 0; i < replies.replies.length; i++) {
      const reply = replies.replies[i];

      // Check if already processed
      const alreadyProcessed = await ProcessedReply.findOne({
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

      let symbol: string | null = null;
      let name: string | null = null;
      let image: string = "https://letsbonk.fun/logos/bonk_fun.png";

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

      if (reply.media_url?.[0]) image = reply.media_url[0];

      console.log(`✅ Processing Reply #${i + 1}`);
      console.log("  Symbol:", symbol);
      console.log("  Name:", name);
      console.log("  Image:", image);
      const uploadedImage = await uploadImage(image);

      const jsonData: metadataInfo = {
        name: name,
        symbol: symbol,
        image: uploadedImage,
        description: "@itsbonked created this token on letsbonk.fun",
        createdOn: "https://bonk.fun"
      };

      const uploadMetadataUrl = await uploadMetadata(jsonData);
      console.log(
        "🚀 ~ processTweetReplies ~ uploadMetadataUrl:",
        uploadMetadataUrl
      );
      const fetchUri = await fetch(uploadMetadataUrl);
      const resText = await fetchUri.text();
      const data = JSON.parse(resText);
      console.log("🚀 ~ processTweetReplies ~ data:", data);

      if (!uploadMetadataUrl) {
        console.log("Metadata upload failed.");
        return;
      }
      try {
        const res = await createMint(data.name, data.symbol, data.image);
        await delay(1500);

        const targetId = reply.tweet_id;
        const content = `Your coin ${name}(${symbol} is live! Link: letsbonk.fun)`;
        // await replyToTweet({target_id: targetId, content: content});
      } catch (error) {
        console.log("Create mint Error: ", error);
      }

      // Mark as processed
      await ProcessedReply.create({ tweetId: reply.tweet_id });
    }
  } catch (error) {
    console.error("❌ Error processing replies:", error);
  }
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
