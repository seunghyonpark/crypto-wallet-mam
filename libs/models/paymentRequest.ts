import mongoose, { model, models, Schema } from "mongoose";
import connectMongo from "../services/database";

connectMongo();

export const paymentRequestSchema = new Schema({
  userToken: {
    type: String,
    required: true,
  },
  email1: {
    type: String,
    unique: false,

    required: true,
  },
  emailVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  withdrawAmount: {
    type: Number,
    required: true,
  },
  withdrawFee: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Waiting",
  },
  walletTo: {
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

export const PaymentRequest = models.PaymentRequest || model("PaymentRequest", paymentRequestSchema);


export const newPaymentRequest = async (
  userToken: string,
  email1: string,
  withdrawAmount: number,
  withdrawFee: number,
  walletTo: string,
  type: string,
) => {


  const newPaymentRequest = new PaymentRequest({
    userToken,
    email1,
    withdrawAmount,
    withdrawFee,
    walletTo,
    type,
    emailVerified: true,
  });
  if (!newPaymentRequest) {
    return null;
  }
  return await newPaymentRequest.save();
};


export const getPaymentRequest = async (_id: string) => {
  const request = await PaymentRequest.find({ _id });
  if (request) {
    return request;
  } else {
    return null;
  }
};

export const getAllPaymentRequests = async () => {
  const requests = await PaymentRequest.find().sort({createdAt: -1});
  if (requests) {
    return requests;
  } else {
    return null;
  }
};

export const getAllpaymentRequestsSum = async () => {
  const response = await PaymentRequest.aggregate([ { $group: { _id: null, total: { $sum: "$withdrawAmount" } } } ]);
  if (response) {
    return response[0].total;
  } else {
    return null;
  }
};

export const getAllPaymentRequestsforUser = async (email1: string) => {
  const requests = await PaymentRequest.find({ email1: email1}).sort({createdAt: -1});
  if (requests) {
    return requests;
  } else {
    return null;
  }
};

export const updatePaymentRequest = async (
  _id: string,
  status: string,
  txHash: string,
  gonderildi: boolean
) => {
  const request = await PaymentRequest.findOneAndUpdate(
    { _id },
    { status, txHash, gonderildi }
  );
  if (request) {
    return request;
  } else {
    return null;
  }
};

export const deletePaymentRequest = async (_id: string) => {
  const deletedRequest = await PaymentRequest.findOneAndDelete({ _id });
  if (deletedRequest) {
    return deletedRequest;
  } else {
    return null;
  }
};
