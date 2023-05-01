import {
  newPaymentRequest,
  getPaymentRequest,
  getAllPaymentRequests,
  getAllpaymentRequestsSum,
  getAllPaymentRequestsforUser,
  updatePaymentRequest,
  deletePaymentRequest,
} from "@/libs/models/paymentRequest";
import { User } from "@/libs/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, API_KEY } = req.body;

  if (API_KEY !== process.env.API_KEY) {
    return res.status(200).json({
      status: false,
      message: "API Key is not valid",
    });
  }

  if (method === "new") {
    const { userToken, email1, withdrawAmount, walletTo, type, authCode, } = req.body;

    console.log(req.body);

    if (!userToken || !email1 || !withdrawAmount || !walletTo || !type || !authCode) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    const user = await User.findOne({ userToken: userToken });

    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found",
      });
    }

    if (type === "Matic" && user.maticBalance < withdrawAmount) {
      return res.status(200).json({
        status: false,
        message: "Not enough Matic",
      });
    }

    if (type === "Coin" && user.deposit < withdrawAmount) {
      return res.status(200).json({
        status: false,
        message: "Not enough Coin",
      });
    }

    const withdrawFee = 50;

    ////const lastWithdrawAmount = withdrawAmount - withdrawFee;


    // check authCode
    ////////


    const newPayment = await newPaymentRequest(
      userToken,
      email1,
      withdrawAmount,
      withdrawFee,
      walletTo,
      type
    );
    if (!newPayment) {
      return res.status(200).json({
        status: false,
        message: "Payment request failed",
      });
    }

    if (newPayment.status === false) {
      return res.status(200).json({
        status: false,
        message: "Request Already Exists",
      });
    }

    if (type === "Matic") {
      user.maticBalance = user.maticBalance - withdrawAmount;
    }

    if (type === "Coin") {
      user.deposit = user.deposit - withdrawAmount;
    }

    const updatedUser = await user.save();
    if (!updatedUser) {
      return res.status(200).json({
        status: false,
        message: "Payment request failed",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Payment request successful",
      newPayment,
    });
  }


  if (method === "getOne") {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const payment = await getPaymentRequest(_id);
    if (!payment) {
      return res.status(200).json({
        status: false,
        message: "Payment request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Payment request successful",
      payment,
    });
  }

  if (method === "getAll") {
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const payments = await getAllPaymentRequests();
    if (!payments) {
      return res.status(200).json({
        status: false,
        message: "Payments request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Payments request successful",
      payments,
    });
  }


  if (method === "getAllAmount") {
    /*
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    */
    const sum = await getAllpaymentRequestsSum();
    if (!sum) {
      return res.status(200).json({
        status: false,
        message: "Sum request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Sum request successful",
      sum,
    });
  }



  if (method === "getAllforUser") {
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ userToken: userToken });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const payments = await getAllPaymentRequestsforUser(user.email);
    if (!payments) {
      return res.status(200).json({
        status: false,
        message: "Payments request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Payments request successful",
      payments,
    });
  }  


  if (method === "update") {
    const { _id, txHash, status, gonderildi } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const payment = await updatePaymentRequest(_id, status, txHash, gonderildi);
    if (!payment) {
      return res
        .status(200)
        .json({ status: false, message: "Payment update failed" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Payment update successful", payment });
  }

  if (method === "reject") {
    const { _id, userToken, txHash, status, gonderildi } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const payment = await updatePaymentRequest(_id, status, txHash, gonderildi);
    if (!payment) {
      return res
        .status(200)
        .json({ status: false, message: "Payment update failed" });
    }
    const user = await User.findOne({ userToken: userToken });
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found",
      });
    }
    if (payment.type === "Matic") {
      user.maticBalance = user.maticBalance + payment.withdrawAmount;
      user.save();
    }
    if (payment.type === "Coin") {
      user.deposit = user.deposit + payment.withdrawAmount;
      user.save();
    }
    return res
      .status(200)
      .json({ status: true, message: "Payment update successful", payment });
  }

  if (method === "delete") {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const payment = await deletePaymentRequest(_id);
    if (!payment) {
      return res
        .status(200)
        .json({ status: false, message: "Payment delete failed" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Payment delete successful", payment });
  }

  return res.status(400).json({ message: "Missing required fields" });
}
