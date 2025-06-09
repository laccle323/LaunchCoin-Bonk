import BN from "bn.js";

export interface IStakingResult {
  user: string;
  count: bigint;
  stakedAmount: bigint;
  time: bigint;
  period: bigint;
}

export interface metadataInfo {
  name: string,
  symbol: string,
  image: string | false,
  description: string,
  createdOn: string
}

export interface coinInfo {
  progressMcap: number;
  lamportReserves: number;
  tokenReserves: number;
  commit: any;
  _id?: string;
  name: string;
  creator: string;
  ticker: string;
  url: string;
  reserveOne: number;
  reserveTwo: number;
  token: string;
  tokenSupply?: number;
  marketcap?: number;
  presale?: BN;
  replies?: BN;
  description?: string;
  twitter?: string;
  website?: string;
  telegram?: string;
  date?: Date;
  bondingCurve: boolean;
}

export interface tokenInfo {
  progressMcap: number;
  lamportReserves: number;
  _id?: string;
  name: string;
  creator: string;
  symbol: string;
  image: string;
  marketcap?: number;
  buyAmount?: Number;
  slippage?: Number;
  description?: string;
  twitter?: string;
  website?: string;
  telegram?: string;
  date?: Date;
  bondingCurve: boolean;
  decimal: number;
  tokenMintA: string;
  token: string;
  commit: any;
  reserveOne: number;
  reserveTwo: number;
  tokenReserves: number;
  tokenSupply?: number;
  poolId: string;
}