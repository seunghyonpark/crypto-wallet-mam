import mongoose from "mongoose";

export interface IHistory {
  _id: mongoose.Types.ObjectId;
  date: Date;
  winnerHorse: string;
  placements: {
    line: number;
    horse: string;
  }[];
}
