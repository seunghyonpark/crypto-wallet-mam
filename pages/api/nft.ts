import {
  makeDepositCoin,
  makeDepositMatic,
  makeWinDepositCoin,
  swapToMatic,
  updateNftWalletAddress,
} from "@/libs/models/user";


import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, API_KEY } = req.body;

  if (API_KEY !== process.env.API_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }


  if (method === "setNftWalletAddress") {
    const { userToken, walletAddress } = req.body;
    if (!userToken || !walletAddress) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    

    const updatedUser = await updateNftWalletAddress(userToken, walletAddress);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
  }


  if (method === "makeMaticDeposit") {
    const { userToken, amount } = req.body;
    if (!userToken || !amount) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const updatedUser = await makeDepositMatic(userToken, amount);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "swapToCoin") {
    const { userToken, amount } = req.body;
    if (!userToken || !amount) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const updatedUser = await makeDepositCoin(userToken, amount);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "winDeposit") {
    const { userToken, amount } = req.body;
    if (!userToken || !amount) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const updatedUser = await makeWinDepositCoin(userToken, amount);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "swapToMatic") {
    const { userToken, amount } = req.body;
    if (!userToken || !amount) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const updatedUser = await swapToMatic(userToken, amount);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "") {
  }





  if (method === "getNftsByWalletAddress") {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    ////const game = await getGameByUsername(username);

    console.log("getNftsByWalletAddress walletAddress", walletAddress);
		
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: "9NN866AniB6YJfboJlS3uOSY9vouXnilnqaz2jH7K7fVjKd0poxLr4Hs8BwyF9UV",
        // ...and any other configuration
      });
    }

    console.log("Moralis walletAddress====", walletAddress)

  
    const address = walletAddress;
  
    ///const chain = EvmChain.ETHEREUM;
    const chain = EvmChain.BSC_TESTNET;
  
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
    });
  
    ///console.log(response.toJSON());

    const nfts = response.toJSON().result;


    ///console.log("nfts", nfts);


    ////setNfts(response.toJSON().result);

    const ownedNfts = new Array();

    /*
    const list = nfts?.map((asset:any) => ({
      token_uri: asset?.token_uri,

    }));
    */


    var list = new Array();

    
    nfts?.map((asset:any) => {
      
      /////console.log("asset.token_uri===", asset.token_uri)

      list.push(asset.token_uri);

      /////const response = await fetch(`http://wallet.treasureverse.io/cracle?userid=${email}`);

    
    });

    ///////console.log("list", list);

    var data = new Array();
    
    for(let idx=0; idx < list.length; idx++){

      const response = await fetch(list[idx]);

      if (response.ok) {

        const jsonTokenUri = await response.json();

        /////console.log("jsonTokenUri image===", jsonTokenUri.image);


        const imageUrl = "https://cloudflare-ipfs.com/ipfs/" + jsonTokenUri.image.substring(7, jsonTokenUri.image.length);

        ///////console.log("imageUrl===", imageUrl);

        data.push(imageUrl);

      }

    }
    
    
	

    return res.status(200).json({ message: "Success", data });
    ///return res.status(200).json({ message: "Success", nfts });
 
  }


}
