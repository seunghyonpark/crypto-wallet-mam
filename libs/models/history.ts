import { IHistory } from "./../interface/historyInterface";
import { model, models, Schema } from "mongoose";
import connectMongo from "../services/database";

connectMongo();

const HistorySchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  winnerHorse: {
    type: String,
    required: true,
  },
  placements: {
    type: Array,
    line: {
      type: Number,
      required: true,
    },
    horse: {
      type: String,
      required: true,
    },
  },
});

export const HistoryModel =
  models.History || model<IHistory>("History", HistorySchema);

export const newHistory = async (
  winnerHorse: string,
  placements: { line: number; horse: string }[]
): Promise<IHistory> => {
  const history = new HistoryModel({ winnerHorse, placements });
  return await history.save();
};

export const getHistory = async (): Promise<IHistory[]> => {
  return await HistoryModel.find().sort({ date: -1 }).limit(15);
};

export const getLastHistory = async (): Promise<IHistory> => {
  return await HistoryModel.findOne().sort({ date: -1 });
};
