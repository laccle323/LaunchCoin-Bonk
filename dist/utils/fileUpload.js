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
exports.uploadMetadata = exports.uploadImage = exports.pinFileToIPFS = void 0;
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
const pinFileToIPFS = (blob) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = new FormData();
        data.append("file", blob);
        const res = yield fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                'pinata_api_key': pinataApiKey || '',
                'pinata_secret_api_key': pinataSecretApiKey || ''
            },
            body: data,
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = yield res.json();
        return resData;
    }
    catch (error) {
        console.error(error);
    }
});
exports.pinFileToIPFS = pinFileToIPFS;
const uploadImage = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(url);
    if (!res.ok) {
        console.error(`Failed to fetch image from URL, status: ${res.status}`);
        return false;
    }
    const blob = yield res.blob();
    const imageFile = new File([blob], "image.png", { type: "image/png" });
    const resData = yield (0, exports.pinFileToIPFS)(imageFile);
    if (resData) {
        return `https://ipfs.io/ipfs/${resData.IpfsHash}`;
    }
    else {
        return false;
    }
});
exports.uploadImage = uploadImage;
const uploadMetadata = (metadata) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
                // Replace YOUR_PINATA_JWT with your actual JWT token
                'pinata_api_key': pinataApiKey || '',
                'pinata_secret_api_key': pinataSecretApiKey || '',
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pinataContent: metadata,
            }),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = yield response.json();
        return `https://ipfs.io/ipfs/${data.IpfsHash}`;
    }
    catch (error) {
        console.error("Error uploading JSON to Pinata:", error);
        throw error;
    }
});
exports.uploadMetadata = uploadMetadata;
