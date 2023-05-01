import {
  createSettings,
  deleteSettings,
  getSettings,
  updateSettings,
} from "./../../libs/models/settings";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, API_KEY } = req.body;
  if (API_KEY !== process.env.API_KEY) {
    res.status(401).json({ status: false, message: "Unauthorized" });
    return;
  }

  if (!method) {
    res.status(400).json({ status: false, message: "Bad Request" });
    return;
  }

  if (method === "create") {
    const { requestType, chat } = req.body;
    if (!requestType || !chat) {
      res.status(400).json({ status: false, message: "Bad Request" });
      return;
    }
    const settings = createSettings(requestType, chat);
    if (!settings) {
      res.status(500).json({ status: true, message: "Internal Server Error" });
      return;
    }
    return res.status(200).json({ message: "Settings created", settings });
  }

  if (method === "get") {
    const settings = await getSettings();
    if (!settings) {
      res.status(500).json({ status: false, message: "Internal Server Error" });
      return;
    }
    return res
      .status(200)
      .json({ status: true, message: "Settings fetched", settings });
  }

  if (method === "update") {
    const { _id, requestType, chat } = req.body;
    if (!_id || !requestType || !chat) {
      res.status(400).json({ status: false, message: "Bad Request" });
      return;
    }
    const settings = await updateSettings(_id, requestType, chat);
    if (!settings) {
      res.status(500).json({ status: false, message: "Internal Server Error" });
      return;
    }
    return res.status(200).json({ status: true, message: "Settings updated" });
  }

  if (method === "delete") {
    const { _id } = req.body;
    if (!_id) {
      res.status(400).json({ status: false, message: "Bad Request" });
      return;
    }
    const deleted = await deleteSettings(_id);
    if (!deleted) {
      res.status(500).json({ status: false, message: "Internal Server Error" });
      return;
    }
    return res.status(200).json({ status: true, message: "Settings deleted" });
  }
}
