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
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyToTweet = replyToTweet;
const request = require('request');
const X_API_KEY = process.env.X_API_KEY;
const X_API_KEY_SECRET = process.env.X_API_KEY_SECRET;
const ACCESS_TOKEN = process.env.X_ACCESS_TOKEN || "access token";
const X_ACCESS_TOKEN_SECRET = process.env.X_ACCESS_TOKEN_SECRET || "access token secret";
const BEAR_TOKEN = process.env.X_BEARER_TOKEN || "bearer token";
function replyToTweet(_a) {
    return __awaiter(this, arguments, void 0, function* ({ target_id, content }) {
        return new Promise((resolve, reject) => {
            request.post({
                url: `https://api.twitter.com/2/tweets`,
                headers: {
                    Authorization: `BEARER ${BEAR_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                // oauth: {
                //   consumer_key: X_API_KEY,
                //   consumer_secret: X_API_KEY_SECRET,
                //   token: ACCESS_TOKEN,
                //   token_secret: X_ACCESS_TOKEN_SECRET,
                // },
                json: true,
                body: {
                    text: content,
                    reply: {
                        in_reply_to_tweet_id: target_id,
                    },
                },
            }, function (err, response, body) {
                console.log("reply tweet err => ", err);
                console.log("reply tweet body => ", body);
                if (err) {
                    return reject(new Error("There was an error through reply tweet"));
                }
                if ((response === null || response === void 0 ? void 0 : response.statusCode) === 403 || (body === null || body === void 0 ? void 0 : body.status) === 403) {
                    return reject(new Error((body === null || body === void 0 ? void 0 : body.detail) || "Forbidden action, user deleted"));
                }
                resolve({ success: true, data: body });
            });
        });
    });
}
