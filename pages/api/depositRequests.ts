import {
  newDepositRequest,
  getDepositRequest,
  getAllDepositRequests,
  getAllDepositRequestsSum,
  getAllDepositRequestsforUser,
  getAllDepositRequestsforUsername,
  updateDepositRequest,
  deleteDepositRequest,
} from "@/libs/models/depositRequest";
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
    const { userToken, email1, withdrawAmount, walletTo, type } = req.body;

    if (!userToken || !email1 || !withdrawAmount || !walletTo || !type) {
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

    const newDeposit = await newDepositRequest(
      userToken,
      email1,
      withdrawAmount,
      walletTo,
      type
    );
    if (!newDeposit) {
      return res.status(200).json({
        status: false,
        message: "Deposit request failed",
      });
    }

    if (newDeposit.status === false) {
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
        message: "Deposit request failed",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Deposit request successful",
      newDeposit,
    });
  }


  if (method === "getOne") {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const deposit = await getDepositRequest(_id);
    if (!deposit) {
      return res.status(200).json({
        status: false,
        message: "Deposit request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Deposit request successful",
      deposit,
    });
  }


  if (method === "getAll") {
    /*
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    */
    const deposits = await getAllDepositRequests();
    if (!deposits) {
      return res.status(200).json({
        status: false,
        message: "Deposits request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Deposits request successful",
      deposits,
    });
  }


  if (method === "getAllAmount") {
    /*
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    */
    const sum = await getAllDepositRequestsSum();
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

    /*
    const user = await User.findOne({ userToken: userToken });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const deposits = await getAllDepositRequestsforUser(user.email);
    if (!deposits) {
      return res.status(200).json({
        status: false,
        message: "Deposits request failed",
      });
    }
    */


    const deposits = await getAllDepositRequestsforUser(userToken);
    if (!deposits) {
      return res.status(200).json({
        status: false,
        message: "Deposits request failed",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Deposits request successful",
      deposits,
    });
  }



  if (method === "getAllforUsername") {

    const { username } = req.body;


    console.log("getAllforUsername username", username);



    if (!username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const depositRequests = await getAllDepositRequestsforUsername(user.username);
    if (!depositRequests) {
      return res.status(200).json({
        status: false,
        message: "Deposit requests failed",
      });
    }

    console.log("getAllforUsername depositRequests", depositRequests[0]);


    return res.status(200).json({
      status: true,
      message: "Deposits request successful",
      depositRequests,
    });

  }  



  if (method === "update") {
    const { _id, txHash, status, gonderildi } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const deposit = await updateDepositRequest(_id, status, txHash, gonderildi);
    if (!deposit) {
      return res
        .status(200)
        .json({ status: false, message: "Deposit update failed" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Deposit update successful", deposit });
  }

  if (method === "reject") {
    const { _id, userToken, txHash, status, gonderildi } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const deposit = await updateDepositRequest(_id, status, txHash, gonderildi);
    if (!deposit) {
      return res
        .status(200)
        .json({ status: false, message: "Deposit update failed" });
    }
    const user = await User.findOne({ userToken: userToken });
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found",
      });
    }
    if (deposit.type === "Matic") {
      user.maticBalance = user.maticBalance + deposit.withdrawAmount;
      user.save();
    }
    if (deposit.type === "Coin") {
      user.deposit = user.deposit + deposit.withdrawAmount;
      user.save();
    }
    return res
      .status(200)
      .json({ status: true, message: "Deposit update successful", deposit });
  }

  if (method === "delete") {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const deposit = await deleteDepositRequest(_id);
    if (!deposit) {
      return res
        .status(200)
        .json({ status: false, message: "Deposit delete failed" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Deposit delete successful", deposit });
  }

  return res.status(400).json({ message: "Missing required fields" });
}
