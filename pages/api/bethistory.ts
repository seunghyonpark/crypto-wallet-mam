import {
  getBetHistory,
  getAllBetHistory,
  getAllBetHistoryBetSum,
  getAllBetHistoryPrizeSum,
  getAllBetHistoryforUser,
} from "@/libs/models/bethistory";




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


  if (method === "getOne") {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const betHistory = await getBetHistory(_id);
    if (!betHistory) {
      return res.status(200).json({
        status: false,
        message: "Bet Histories request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Bet Histories request successful",
      betHistory,
    });
  }

  if (method === "getAll") {
    
    /*
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    */

    const betHistory = await getAllBetHistory();

    if (!betHistory) {
      return res.status(200).json({
        status: false,
        message: "Bet histories request failed",
      });
    }


    return res.status(200).json({
      status: true,
      message: "Bet histories request successful",
      betHistory,
    });
  }

  

  if (method === "getAllBetAmount") {

    const sum = await getAllBetHistoryBetSum();
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


  if (method === "getAllPrizeAmount") {
    /*
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    */
    const sum = await getAllBetHistoryPrizeSum();
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

    const betHistory = await getAllBetHistoryforUser(user.username);
    if (!betHistory) {
      return res.status(200).json({
        status: false,
        message: "Bet histories request failed",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Bet histories request successful",
      betHistory,
    });
  }



  if (method === "getAllforUsername") {

    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const betHistory = await getAllBetHistoryforUser(user.username);
    if (!betHistory) {
      return res.status(200).json({
        status: false,
        message: "Bet histories request failed",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Bet histories request successful",
      betHistory,
    });
  }


  return res.status(400).json({ message: "Missing required fields" });
}
