import mongoose from "mongoose";

export interface ISettings {
  _id: mongoose.Types.ObjectId;
  requestType: string;
  chat: boolean;
}
