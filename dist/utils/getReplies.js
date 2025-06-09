"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTweetReplies = fetchTweetReplies;
const https_1 = __importDefault(require("https"));
const config_1 = require("../config");
function fetchTweetReplies(tweetId) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            hostname: config_1.X_RAPIDAPI_HOST,
            port: null,
            path: `/tweet/replies?tweet_id=${tweetId}`,
            headers: {
                'x-rapidapi-key': config_1.X_RAPIDAPI_KEY,
                'x-rapidapi-host': config_1.X_RAPIDAPI_HOST,
                'Content-Type': 'application/json'
            }
        };
        const req = https_1.default.request(options, (res) => {
            const chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                resolve(body);
            });
        });
        req.on('error', (err) => {
            reject(err);
        });
        req.write(JSON.stringify({ tweet_id: tweetId }));
        req.end();
    });
}
