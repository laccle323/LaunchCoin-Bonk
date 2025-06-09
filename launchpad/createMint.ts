import {
  TxVersion,
  DEV_LAUNCHPAD_PROGRAM,
  getPdaLaunchpadConfigId,
  LaunchpadConfig,
  findProgramAddress,
  LAUNCHPAD_POOL_SEED,
  ProgramAddress,
  LAUNCHPAD_PROGRAM
} from "@raydium-io/raydium-sdk-v2";
import BN from "bn.js";
import {
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";
import { NATIVE_MINT } from "@solana/spl-token";
import { initSdk } from "./config";
import { metadataInfo, tokenInfo } from "../utils/types";
import base58 from "bs58";
import { CREATOR, solConnection } from "../config";
import fs from "fs";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { execTx } from "../utils/utils";

export const createMint = async (
  name: string,
  symbol: string,
  image: string
) => {
  const creatorKp = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(CREATOR, "utf-8"))),
    { skipValidation: true }
  );
  const creatorWallet = new NodeWallet(creatorKp);

  const raydium = await initSdk(creatorWallet.publicKey);

  const programId = LAUNCHPAD_PROGRAM; // devent: DEV_LAUNCHPAD_PROGRAM, mainnet: LAUNCHPAD_PROGRAM

  // const creationFee = 0.1 * 10 ** 9;

  let mintKp: Keypair | undefined;

  mintKp = Keypair.generate();

  const mintA = mintKp.publicKey;

  const configId = getPdaLaunchpadConfigId(
    programId,
    NATIVE_MINT,
    0,
    0
  ).publicKey;
  console.log("🚀 ~ configId:", configId)

  const configData = await solConnection.getAccountInfo(configId);
  console.log("🚀 ~ configData:", configData)
  if (!configData) throw new Error("config not found");

  const configInfo = LaunchpadConfig.decode(configData.data);
  console.log("🚀 ~ configInfo:", configInfo)
  const mintBInfo = NATIVE_MINT;
  console.log("🚀 ~ mintBInfo:", mintBInfo)

  function getPdaLaunchpadPoolId(
    programId: PublicKey,
    mintA: PublicKey,
    mintB: PublicKey
  ): ProgramAddress {
    return findProgramAddress(
      [LAUNCHPAD_POOL_SEED, mintA.toBuffer(), mintB.toBuffer()],
      programId
    );
  }

  const poolId = getPdaLaunchpadPoolId(
    LAUNCHPAD_PROGRAM,
    mintA,
    configInfo.mintB
  );
  // Rayidum UI usage: https://github.com/raydium-io/raydium-ui-v3-public/blob/master/src/store/useLaunchpadStore.ts#L329
  const { transactions } = await raydium.launchpad.createLaunchpad({
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
    slippage: new BN(100),
    platformId: new PublicKey("FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1"), // default RAYDIUM playform in mainnet 4Bu96XjU84XjPDSpveTVf6LYGCkfW5FK7SNkREWcEfV4
    txVersion: TxVersion.LEGACY,
    buyAmount: new BN(100),


    feePayer: creatorWallet.publicKey,
    createOnly: false, // true means create mint only, false will "create and buy together"
    extraSigners: [mintKp],
    computeBudgetConfig: {
      // priority fee in tx, if not attached, the mainnet tx can go fail with blockheight exceeded error with long time confirmation
      units: 600_000,
      microLamports: 1_000_000
    }
  });
  console.log("🚀 ~ transactions:", transactions)

  transactions[0].recentBlockhash  = (await solConnection.getLatestBlockhash()).blockhash;
  transactions[0].sign(mintKp);

  await execTx(transactions[0], solConnection, creatorWallet);
 };
