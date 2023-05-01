import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  emailVerified: boolean;
  pass1: string | boolean;
  pass2: string;
  deposit: number;
  img: string;
  admin: boolean;
  adminLevel: number;
  newPassToken: string;
  userToken: string;
  maticBalance: number;
  walletAddress: string;
  nftWalletAddress: string;
  referralCode: string;
  referral: string;
  authCode: string;
}
