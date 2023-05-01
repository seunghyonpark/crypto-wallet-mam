import { model, models, Schema } from "mongoose";
import { IGame } from "../interface/game";
import connectMongo from "../services/database";
import { User } from "./user";

connectMongo();

const GameSchema = new Schema({
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
  selectedSide: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
});

export const Game = models.Game || model("Game", GameSchema);

export const newGame = async (
  userToken: string,
  username: string,
  img: string,
  betAmount: number,
  selectedSide: string
) => {

  const games = await Game.findOne({ userToken: userToken });
  
  if (games) {
    return { success: false, message: "User already in game" };
  }

  const game = new Game({
    userToken: userToken,
    username: username,
    img: img,
    betAmount: betAmount,
    selectedSide: selectedSide,
    basePrice: 0,
  });

  const user = await User.findOne({ userToken: userToken });
  if (user) {
    user.deposit -= betAmount;
    await user.save();
  } else {
    return { success: false, message: "User not found" };
  }
  await game.save();
  return { success: true, game };
};



export const getGames = async () => {
  let games: IGame[];
  games = await Game.find({}).sort({ _id: -1 });
  return games;
};

export const getGameByToken = async (userToken: string) => {
  return Game.findOne({ userToken });
};

export const getGameByUsername = async (username: string) => {
  return Game.findOne({ username: username });
};




export const deleteOneGame = async (
  userToken: string,
  selectedSide: string
) => {
  return Game.deleteOne({ userToken: userToken, selectedSide: selectedSide });
};

export const deleteGames = async () => {
  let games: IGame[];
  games = await Game.find({}).sort({ _id: -1 });
  await Game.deleteMany({}, games);
  return { success: true, games };
};
