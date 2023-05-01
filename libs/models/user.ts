import { IUser } from "./../interface/user";
import { model, models, Schema } from "mongoose";
import connectMongo from "../services/database";
import Coin from "../enums/coin.enum";
import { useUser } from "@thirdweb-dev/react";

connectMongo();

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  emailVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  pass1: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  pass2: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  deposit: {
    type: Number,
    required: false,
    default: 0,
  },
  img: {
    type: String,
    required: true,
    default: "enter your image url",
  },
  admin: {
    type: Boolean,
    required: false,
    default: false,
  },
  adminLevel: {
    type: Number,
    required: false,
    default: false,
  },
  newPassToken: {
    type: String,
    required: false,
    default: "",
  },
  userToken: {
    type: String,
    required: true,
  },
  maticBalance: {
    type: Number,
    required: false,
    default: 0,
  },
  walletAddress: {
    type: String,
    required: false,
    default: "",
  },
  nftWalletAddress: {
    type: String,
    required: false,
    default: "",
  },
  status: {
    type: Boolean,
    default: true,
  },
  referralCode: {
    type: String,
    required: false,
    default: "",
  },
  referral: {
    type: String,
    required: false,
    default: "root",
  },
  authCode: {
    type: String,
    required: false,
    default: "",
  },
});

export const User = models.User || model("User", UserSchema);



export const getUserByEmail = async (email: string) => {

  ///console.log("getUserByEmail email", email);

  const user: IUser = (await User.findOne({ email1: email })) as IUser;

  if (user) {
    return { success: true, user };
  } else {
    return { success: false, message: "User not found" };
  }
};


export const getUserByUsername = async (username: string) => {

  console.log("getUserByUsername username", username);

  const user: IUser = (await User.findOne({ username: username })) as IUser;
  if (user) {
    return { success: true, user };
  } else {
    return { success: false, message: "User not found" };
  }

};



export const newUser = async (
  username: string,
  email: string,
  pass1: string,
  pass2: string,
  userToken: string,
  ////walletAddress: string,
  nftWalletAddress: string,
  referral: string,
) => {
  
    const checkUserByEmail = await User.find({ email: email });
    if (checkUserByEmail.length > 0) {
      return { success: false, message: "User email already exists" };
    }


    const checkUserByUsername = await User.find({ username: username });
    if (checkUserByUsername.length > 0) {
      return { success: false, message: "User nick name already exists" };
    }



    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referralCode = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        referralCode += chars[randomIndex];
    }

    ////console.log("referralCode", referralCode);


    const user = new User({
      username: username,
      email: email,
      pass1: pass1,
      pass2: pass2,
      userToken: userToken,
      ////walletAddress: walletAddress,
      nftWalletAddress: nftWalletAddress,
      img: "/profile_default.gif",
      referralCode: referralCode,
      referral: referral,
    });

    return await user.save();
};






export const setUserByEmail = async (
  email: string,
  userToken: string,
  authCode: string,
) => {

  /*
  console.log("setUserByEmail email", email);
  console.log("setUserByEmail userToken", userToken);
  console.log("setUserByEmail authCode", authCode);
  */

  
  const updatedUser: IUser = (await User.findOneAndUpdate(
    { email: email },
    {
      authCode: authCode,
    },
    { new: true }
  )) as IUser;

  if (updatedUser) {

    return { success: true, message: updatedUser };
    
  } else {

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referralCode = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        referralCode += chars[randomIndex];
    }

    ///console.log("referralCode", referralCode);

    const user = new User({
      username: userToken,
      email: email,
      emailVerified: false,
      pass1: userToken,
      pass2: userToken,
      userToken: userToken,
      img: "/profile_default.gif",
      referralCode: referralCode,
      authCode: authCode,
    });

    ///console.log("setUserByEmail new user", user)


    const result = await user.save();

    return { success: true, message: result };

  }

};



export const verifyUserByEmail = async (
  email: string,
  authCode: string,
) => {

  ///console.log("verifyUserByEmail email", email);
  ///console.log("verifyUserByEmail authCode", authCode);


  const updatedUser: IUser = (await User.findOneAndUpdate(
    { $and:[{ email: email }, { authCode: authCode }] },
    {
      emailVerified: true,
    },
    { new: true }
  )) as IUser;

  //////console.log("updatedUser", updatedUser)

  if (updatedUser) {
    return { success: true, updatedUser };
  }

  return { success: false, message: "User not found" };

};






export const setUserAuthCode = async (
  userToken: string,
  authCode: string,
) => {


  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      authCode: authCode,
    },
    { new: true }
  )) as IUser;


  ////console.log("setUserAuthCode updatedUser", updatedUser)

  if (updatedUser) {
    return { success: true, user: updatedUser };
  }

  return { success: false, message: "User not found" };
};




export const loginUser = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (user) {


    if (user.referralCode === "") {

      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let referralCode = '';
      for (let i = 0; i < 5; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          referralCode += chars[randomIndex];
      }


      user.referralCode = referralCode;
      await user.save();
    }



    return { success: true, user };
  } else {
    return { success: false, message: "User not found" };
  }
};


export const getUser = async (userToken: string) => {
  const user: IUser = (await User.findOne({ userToken: userToken })) as IUser;
  if (user) {
    return { success: true, user };
  } else {
    return { success: false, message: "User not found" };
  }
};

export const getAllUsers = async () => {
  const users: IUser[] = ( await User.find({ status: true }).sort({ _id: -1}) ) as IUser[];
  if (users) {
    return { success: true, users };
  } else {
    return { success: false, message: "Users not found" };
  }
};


export const getAllUsersByReferral = async (referral: string) => {
  const users: IUser[] = ( await User.find({ status: true, referral: referral }) ) as IUser[];
  if (users) {
    return { success: true, users };
  } else {
    return { success: false, message: "Users not found" };
  }
};



export const updateUserByEmail = async (
  email: string,
  username: string,
  pass1: string,
  pass2: string,
  nftWalletAddress: string,
  referral: string,
) => {


  const checkUserByUsername = await User.find({ username: username });
  if (checkUserByUsername.length > 0) {
    return { success: false, message: "User nick name already exists" };
  }

  if (referral && referral !== "") {
    const checkUserByReferralCode = await User.find({ referralCode: referral });
    if (checkUserByReferralCode.length === 0) {
      return { success: false, message: "User referral code does not exists" };
    }
  }




  const updatedUser: IUser = (await User.findOneAndUpdate(
    { email: email },
    {
      username: username,
      pass1: pass1,
      pass2: pass2,
      nftWalletAddress: nftWalletAddress,
      referral: referral,
    },
    { new: true }
  )) as IUser;

  if (updatedUser) {
    return { success: true, updatedUser };
  }

  return { success: false, message: "User not found" };

};




export const updatePasswordByEmail = async (
  email: string,
  pass1: string,
  pass2: string,
  authCode: string,
) => {

  const updatedUser: IUser = (await User.findOneAndUpdate(
    { $and:[{ email: email }, { authCode: authCode }] },
    {
      pass1: pass1,
      pass2: pass2,
    },
    { new: true }
  )) as IUser;

  if (updatedUser) {
    return { success: true, updatedUser };
  }

  return { success: false, message: "User not found" };
};



export const updateUser = async (
  userToken: string,
  //username: string,
  //email: string,
  //pass1: string,
  //pass2: string,
  //deposit: number,
  //img: string,
  admin: boolean,
  //newPassToken: string,
  //maticBalance: number,
  //walletAddress: string,
) => {


  console.log("updateUser userToken: ", userToken);
  console.log("updateUser admin: ", admin);
  

  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      //username: username,
      //email: email,
      //pass1: pass1,
      //pass2: pass2,
      //deposit: deposit,
      //img: img,
      admin: admin,
      //newPassToken: newPassToken,
      //maticBalance: maticBalance,
      //walletAddress: walletAddress,
    },
    { new: true }
  )) as IUser;

  if (updatedUser) {
    return { success: true, updatedUser };
  }

  return { success: false, message: "User not found" };
};



export const updateUserEmailVerified = async (
  userToken: string,
) => {
  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      emailVerified: true,
    },
    { new: true }
  )) as IUser;
  if (updatedUser) {
    return { success: true, updatedUser };
  }
  return { success: false, message: "User not found" };
};



export const updateUserProfileImage = async (
  userToken: string,
  img: string,
) => {
  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      img: img,
    },
    { new: true }
  )) as IUser;
  if (updatedUser) {
    return { success: true, updatedUser };
  }
  return { success: false, message: "User not found" };
};


export const updateUserPassword = async (
  userToken: string,
  currentPassword: string,
  pass1: string,
  pass2: string,
) => {

  ////console.log("updateUserPassword userToken: ", userToken);

  const user = await User.findOne({ userToken: userToken });

  ////console.log("updateUserPassword user: ", user);

  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (user.pass1 !== currentPassword) {
    return { success: false, message: `Wrong password` };
  }


  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      pass1: pass1,
      pass2: pass2,
    },
    { new: true }
  )) as IUser;

  ////console.log("updateUserPassword updatedUser: ", updatedUser);


  if (updatedUser) {
    return { success: true, updatedUser };
  }

  return { success: false, message: "User not found" };
};


export const updateUserWalletAddress = async (
  userToken: string,
  walletAddress: string,
) => {


  ///console.log("updateUserWalletAddress userToken: ", userToken);

  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      walletAddress: walletAddress,
    },
    { new: true }
  )) as IUser;
  if (updatedUser) {
    return { success: true, updatedUser };
  }
  return { success: false, message: "User not found" };
};


export const deleteUser = async (userToken: string) => {

  const pasifUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      status: false,
    },
    { new: true }
  )) as IUser;

  if (pasifUser) {
    return { success: true, pasifUser };
  }
  
  return { success: false, message: "User not found" };
};



export const makeDepositMatic = async (userToken: string, amount: number) => {
  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      $inc: { maticBalance: amount },
    },
    { new: true }
  )) as IUser;
  if (updatedUser) {
    return { success: true, updatedUser };
  }
  return { success: false, message: "User not found" };
};

export const makeDepositCoin = async (userToken: string, amount: number) => {
  const user = await User.findOne({ userToken: userToken });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (user.maticBalance < amount) {
    return { success: false, message: `Not Enough ${Coin.name}` };
  }
  user.deposit += amount * Coin.katSayi;
  user.maticBalance -= amount;
  await user.save();
  return { success: true, user };
};

export const makeWinDepositCoin = async (userToken: string, amount: number) => {
  const user = await User.findOne({ userToken: userToken });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  user.deposit += amount;
  await user.save();
  return { success: true, user };
};

export const swapToMatic = async (userToken: string, amount: number) => {
  const user = await User.findOne({ userToken: userToken });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (user.deposit < amount) {
    return { success: false, message: `Not Enough ${Coin.name}` };
  }
  user.deposit -= amount;
  user.maticBalance += amount / Coin.katSayi;
  await user.save();
  return { success: true, user };
};

export const makeWithdrawMatic = async (userToken: string, amount: number) => {
  const user = await User.findOne({ userToken: userToken });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (user.maticBalance < amount) {
    return { success: false, message: "Not Enough Matic" };
  }
  user.maticBalance -= amount;
  await user.save();
  return { success: true, user };
};


export const updateNftWalletAddress = async (userToken: string, nftWalletAddress: string) => {
  const user = await User.findOne({ userToken: userToken });
  if (!user) {
    return { success: false, message: "User not found" };
  }

  user.nftWalletAddress = nftWalletAddress;
  await user.save();
  return { success: true, user };
};
