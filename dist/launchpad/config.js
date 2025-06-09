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
exports.grpcToken = exports.grpcUrl = exports.initSdk = exports.txVersion = exports.connection = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../config");
exports.connection = new web3_js_1.Connection(config_1.RPC_ENDPOINT); // Replace with actual RPC URL
exports.txVersion = raydium_sdk_v2_1.TxVersion.LEGACY;
const cluster = 'mainnet'; // 'mainnet' | 'devnet'
let raydium;
// Initialize the Raydium SDK and return it
const initSdk = (wallet, params) => __awaiter(void 0, void 0, void 0, function* () {
    if (raydium)
        return raydium;
    // Print a warning if using a free RPC node
    if (exports.connection.rpcEndpoint === (0, web3_js_1.clusterApiUrl)('mainnet-beta')) { // mainnet-beta
        console.warn('Using free RPC node might cause unexpected errors. Consider using a paid RPC node.');
    }
    // Load the Raydium SDK
    raydium = yield raydium_sdk_v2_1.Raydium.load({
        owner: wallet,
        connection: exports.connection,
        cluster,
        disableFeatureCheck: true,
        disableLoadToken: !(params === null || params === void 0 ? void 0 : params.loadToken),
        blockhashCommitment: 'finalized',
    });
    return raydium;
});
exports.initSdk = initSdk;
exports.grpcUrl = '<YOUR_GRPC_URL>';
exports.grpcToken = '<YOUR_GRPC_TOKEN>';
