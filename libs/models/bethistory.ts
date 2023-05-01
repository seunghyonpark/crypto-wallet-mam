import mongoose, { model, models, Schema } from "mongoose";
import connectMongo from "../services/database";

connectMongo();


const BetHistorySchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  userToken: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  selectedSide: {
    type: String,
    required: true,
  },
  closePrice: {
    type: Number,
    required: true,
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

  prizeAmount: {
    type: Number,
    required: true,
  },
  resultAmount: {
    type: Number,
    required: true,
  },
  prizeFee: {
    type: Number,
    required: false,
  },
  depositBefore: {
    type: Number,
    required: true,
  },
  depositAfter: {
    type: Number,
    required: true,
  },

});




export const Bethistory = models.Bethistory || model("Bethistory", BetHistorySchema);



export const getBetHistory = async (_id: string) => {
  const request = await Bethistory.find({ _id });
  if (request) {
    return request;
  } else {
    return null;
  }
};


export const getAllBetHistory = async () => {
  const requests = await Bethistory.find().sort( { date: -1 } ).limit(100);
  if (requests) {
    return requests;
  } else {
    return null;
  }
};

export const getAllBetHistoryBetSum = async () => {
  const response = await Bethistory.aggregate([ { $group: { _id: null, total: { $sum: "$betAmount" } } } ]);

  if (response) {
    return response[0].total / 1000000000000000;
  } else {
    return null;
  }
};

export const getAllBetHistoryPrizeSum = async () => {
  const response = await Bethistory.aggregate([ { $group: { _id: null, total: { $sum: "$prizeAmount" } } } ]);
  if (response) {
    return response[0].total / 1000000000000000;
  } else {
    return null;
  }
};


export const getAllBetHistoryforUser = async (username: string) => {
  const requests = await Bethistory.find({ username: username }).sort( { date: -1 } );
  if (requests) {
    return requests;
  } else {
    return null;
  }
};
