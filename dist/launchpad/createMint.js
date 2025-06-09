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
exports.createMint = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const bn_js_1 = __importDefault(require("bn.js"));
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const config_1 = require("./config");
const config_2 = require("../config");
const fs_1 = __importDefault(require("fs"));
const nodewallet_1 = __importDefault(require("@coral-xyz/anchor/dist/cjs/nodewallet"));
const utils_1 = require("../utils/utils");
const createMint = (name, symbol, image) => __awaiter(void 0, void 0, void 0, function* () {
    const creatorKp = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs_1.default.readFileSync(config_2.CREATOR, "utf-8"))), { skipValidation: true });
    const creatorWallet = new nodewallet_1.default(creatorKp);
    const raydium = yield (0, config_1.initSdk)(creatorWallet.publicKey);
    const programId = raydium_sdk_v2_1.LAUNCHPAD_PROGRAM; // devent: DEV_LAUNCHPAD_PROGRAM, mainnet: LAUNCHPAD_PROGRAM
    // const creationFee = 0.1 * 10 ** 9;
    let mintKp;
    mintKp = web3_js_1.Keypair.generate();
    const mintA = mintKp.publicKey;
    const configId = (0, raydium_sdk_v2_1.getPdaLaunchpadConfigId)(programId, spl_token_1.NATIVE_MINT, 0, 0).publicKey;
    console.log("🚀 ~ configId:", configId);
    const configData = yield config_2.solConnection.getAccountInfo(configId);
    console.log("🚀 ~ configData:", configData);
    if (!configData)
        throw new Error("config not found");
    const configInfo = raydium_sdk_v2_1.LaunchpadConfig.decode(configData.data);
    console.log("🚀 ~ configInfo:", configInfo);
    const mintBInfo = spl_token_1.NATIVE_MINT;
    console.log("🚀 ~ mintBInfo:", mintBInfo);
    function getPdaLaunchpadPoolId(programId, mintA, mintB) {
        return (0, raydium_sdk_v2_1.findProgramAddress)([raydium_sdk_v2_1.LAUNCHPAD_POOL_SEED, mintA.toBuffer(), mintB.toBuffer()], programId);
    }
    const poolId = getPdaLaunchpadPoolId(raydium_sdk_v2_1.LAUNCHPAD_PROGRAM, mintA, configInfo.mintB);
    // Rayidum UI usage: https://github.com/raydium-io/raydium-ui-v3-public/blob/master/src/store/useLaunchpadStore.ts#L329
    const { transactions } = yield raydium.launchpad.createLaunchpad({
        programId,
        mintA,
        decimals: 6,
        name: name,
        symbol: symbol,
        migrateType: "amm",
        uri: image,
        configId,
        configInfo, // optional, sdk will get data by configId if not provided//bonk.fun id - FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1
        mintBDecimals: 9, // default 9//this is my id - 9MJwEH3bWhwTJVvLVjWefTY4SmVqBPJoFR84i8HBbAkD
        slippage: new bn_js_1.default(100),
        platformId: new web3_js_1.PublicKey("FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1"), // default RAYDIUM playform in mainnet 4Bu96XjU84XjPDSpveTVf6LYGCkfW5FK7SNkREWcEfV4
        txVersion: raydium_sdk_v2_1.TxVersion.LEGACY,
        buyAmount: new bn_js_1.default(100),
        feePayer: creatorWallet.publicKey,
        createOnly: false, // true means create mint only, false will "create and buy together"
        extraSigners: [mintKp],
        computeBudgetConfig: {
            // priority fee in tx, if not attached, the mainnet tx can go fail with blockheight exceeded error with long time confirmation
            units: 600000,
            microLamports: 1000000
        }
    });
    console.log("🚀 ~ transactions:", transactions);
    transactions[0].recentBlockhash = (yield config_2.solConnection.getLatestBlockhash()).blockhash;
    transactions[0].sign(mintKp);
    yield (0, utils_1.execTx)(transactions[0], config_2.solConnection, creatorWallet);
});
exports.createMint = createMint;
