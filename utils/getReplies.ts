import https from 'https';
import { X_RAPIDAPI_HOST, X_RAPIDAPI_KEY } from "../config"

export function fetchTweetReplies(tweetId: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const options = {
			method: 'POST',
			hostname: X_RAPIDAPI_HOST,
			port: null,
			path: `/tweet/replies?tweet_id=${tweetId}`,
			headers: {
				'x-rapidapi-key': X_RAPIDAPI_KEY,
				'x-rapidapi-host': X_RAPIDAPI_HOST,
				'Content-Type': 'application/json'
			}
		};

		const req = https.request(options, (res) => {
			const chunks: Buffer[] = [];

			res.on('data', (chunk: Buffer) => {
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