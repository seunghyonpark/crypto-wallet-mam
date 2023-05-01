import mongoose, { model, models, Schema } from "mongoose";
import connectMongo from "../services/database";
import { User } from "./user";

connectMongo();

export const depositRequestSchema = new Schema({
  userToken: {
    type: String,
    required: true,
  },
  email1: {
    type: String,
    unique: false,
    required: true,
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Waiting",
  },
  walletFrom: {
    type: String,
    required: true,
  },
  gonderildi: {
    type: Boolean,
    default: false,
  },
  txHash: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: true,
    default: "Matic",
  },
});


export const DepositRequest = models.DepositRequest || model("DepositRequest", depositRequestSchema);

export const newDepositRequest = async (
  userToken: string,
  email1: string,
  depositAmount: number,
  walletFrom: string,
  type: string
) => {
  const newDepositRequest = new DepositRequest({
    userToken,
    email1,
    depositAmount,
    walletFrom,
    type,
  });
  if (!newDepositRequest) {
    return null;
  }
  return await newDepositRequest.save();
};

export const getDepositRequest = async (_id: string) => {
  const request = await DepositRequest.find({ _id });
  if (request) {
    return request;
  } else {
    return null;
  }
};

export const getAllDepositRequests = async () => {
  const requests = await DepositRequest.find().sort({ createdAt: -1 });
  if (requests) {
    return requests;
  } else {
    return null;
  }
};


export const getAllDepositRequestsSum = async () => {
  const response = await DepositRequest.aggregate([ { $group: { _id: null, total: { $sum: "$depositAmount" } } } ]);
  if (response) {
    return response[0].total;
  } else {
    return null;
  }
};




export const getAllDepositRequestsforUser = async (userToken: string) => {

  const requests = await DepositRequest.find({ userToken: userToken}).sort( { createdAt: -1 } );

  if (requests) {
    return requests;
  } else {
    return null;
  }
};


export const getAllDepositRequestsforUsername = async (username: string) => {

  const user = await User.findOne({ username: username });
  if (!user) {
    return null;
  }

  const requests = await DepositRequest.find({ userToken: user.userToken}).sort( { createdAt: -1 } );

  //////console.log("getAllDepositRequestsforUser requests", requests);

  if (requests) {
    return requests;
  } else {
    return null;
  }
};



export const updateDepositRequest = async (
  _id: string,
  status: string,
  txHash: string,
  gonderildi: boolean
) => {
  const request = await DepositRequest.findOneAndUpdate(
    { _id },
    { status, txHash, gonderildi }
  );
  if (request) {
    return request;
  } else {
    return null;
  }
};

export const deleteDepositRequest = async (_id: string) => {
  const deletedRequest = await DepositRequest.findOneAndDelete({ _id });
  if (deletedRequest) {
    return deletedRequest;
  } else {
    return null;
  }
};
