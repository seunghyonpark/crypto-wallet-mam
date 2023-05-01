//import { IUser } from "./../interface/user";
import { model, models, Schema } from "mongoose";
import connectMongo from "../services/database";
///import Coin from "../enums/coin.enum";

connectMongo();

const TokenSchema = new Schema({
  userToken: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

export const Token = models.Token || model("Token", TokenSchema);



export const createToken = async (
  userToken: string,
  type: string,
  expireAt: Date,
) => {

  const token = new Token({
    userToken: userToken,
    type: type,
    expireAt: expireAt,
  });
  
  return await token.save();
};



export const getToken = async (emailToken: string) => {
  const token = (await Token.findOne({ _id: emailToken })) ;
  if (token) {
    return { success: true, token };
  } else {
    return { success: false, message: "token not found" };
  }
};

