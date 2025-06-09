const request = require('request');

const X_API_KEY = process.env.X_API_KEY!;
const X_API_KEY_SECRET = process.env.X_API_KEY_SECRET!;
const ACCESS_TOKEN = process.env.X_ACCESS_TOKEN || "access token";
const X_ACCESS_TOKEN_SECRET = process.env.X_ACCESS_TOKEN_SECRET || "access token secret";
const BEAR_TOKEN = process.env.X_BEARER_TOKEN || "bearer token";

export interface ReplyParams {
  target_id: string;
  content: string;
}

export async function replyToTweet({ target_id, content }: ReplyParams): Promise<any> {
  return new Promise((resolve, reject) => {
    request.post(
      {
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
      },

      function (
        err: any,
        response: { statusCode: number },
        body: { status?: number; detail?: any }
      ) {
        console.log("reply tweet err => ", err);
        console.log("reply tweet body => ", body);

        if (err) {
          return reject(new Error("There was an error through reply tweet"));
        }

        if (response?.statusCode === 403 || body?.status === 403) {
          return reject(new Error(body?.detail || "Forbidden action, user deleted"));
        }
        resolve({ success: true, data: body });

      }
    );
  });
}
