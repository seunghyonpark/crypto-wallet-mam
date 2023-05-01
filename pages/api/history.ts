import { getHistory, getLastHistory, newHistory } from "@/libs/models/history";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, API_KEY } = req.body;

  if (API_KEY !== process.env.API_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  if (method === "createNew") {
    const { winnerHorse, placements } = req.body;
    const createNew = await newHistory(winnerHorse, placements);
    if (!createNew)
      return res.status(400).json({ status: false, message: "Error" });
    return res.status(200).json({ status: true, createNew });
  }

  if (method === "getAll") {
    const all = await getHistory();
    if (!all) return res.status(400).json({ status: false, message: "Error" });
    return res.status(200).json({ status: true, all });
  }
  
  if (method === "getLast") {
    const lastGame = await getLastHistory();
    if (!lastGame) {
      return res.status(200).json({
        status: false,
        message: "No game has been played yet",
      });
    } else {
      return res.status(200).json({ status: true, lastGame });
    }
  }
}
