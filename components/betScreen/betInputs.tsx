'use client';
import API from '@/libs/enums/API_KEY';
import Horses from '@/libs/enums/horses.enums';
import { IUser } from '@/libs/interface/user';
import { getCookie, hasCookie } from 'cookies-next';
import React, { useEffect, useState, useMemo } from 'react';
import { FaCoins } from 'react-icons/fa';

import { Stack, Snackbar, Alert } from "@mui/material";

//@ts-ignore
import { io } from "socket.io-client";
import SocketEnum from '@/libs/enums/socket';


// code for web3
import {
    useDisconnect,
    useActiveClaimConditionForWallet,
    useAddress,
    useClaimConditions,
    useClaimedNFTSupply,
    useClaimerProofs,
    useClaimIneligibilityReasons,
    useContract,
    useContractMetadata,
    useUnclaimedNFTSupply,
    Web3Button,
  } from "@thirdweb-dev/react";
  import { BigNumber, utils } from "ethers";
  import { parseIneligibility } from "../../utils/parseIneligibility";

  import { ThirdwebSDK } from "@thirdweb-dev/sdk";
  import { BinanceTestnet } from "@thirdweb-dev/chains";

  const sdk = new ThirdwebSDK(
    BinanceTestnet,
  );


  
  
  // Put Your NFT Drop Contract address from the dashboard here
  //const myNftDropContractAddress = "0x90E2dD8C48cA35534Dd70e3eC19B362cdf71981E";
  
  const myNftDropContractAddress = "0x547C5b4F0936Af17bc79a85D9C5f07Ec20d8C12c";



export default function BetInputs({ socket, horse1, horse2, currentPrice, setBasePrice, setLongShort, setMyBetAmount}: any) {
    const [user, setUser] = useState<IUser>()
    const [secilenAt, setSecilenAt] = useState<any>(null)
    const [betAmount, setBetAmount] = useState<any>(0)

    const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
    const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");
    const [succ, setSucc] = React.useState(false);
    const [err, setErr] = React.useState(false);

    const handleClickSucc = () => {
        setSucc(true);
    };
    
    const handleCloseSucc = (
        event?: React.SyntheticEvent | Event,
        reason?: string
        ) => {
        if (reason === "clickaway") {
            return;
        }

        setSucc(false);
    };

    const handleClickErr = () => {
        setErr(true);
    };

    const handleCloseErr = (
        event?: React.SyntheticEvent | Event,
        reason?: string
        ) => {
        if (reason === "clickaway") {
            return;
        }

        setErr(false);
    };

    const getUser = async () => {
        const inputs = {
            method: 'getOne',
            API_KEY: process.env.API_KEY,
            userToken: getCookie('user')
        }
        const res = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs)
        })
        const user = await res.json()
        setUser(user.user.user)
    }


    useEffect(() => {

        if (hasCookie('user')) {
            getUser()
        }

      
    }, [])
    


    /*
    const placeBet = async () => {
        if (user) {

            if (betAmount > user?.deposit) return alert('You dont have enough money to bet this amount');

            if (betAmount === 0) return alert('You need to enter a bet amount');

            if (betAmount < 0) return alert('You cannot bet a negative amount');

            if (secilenAt === null) return alert('You need to select a horse to bet');

            const formInputs = {
                method: 'newGame',
                API_KEY: process.env.API_KEY,
                userToken: getCookie('user'),
                img: user?.img,
                username: user?.username,
                betAmount: betAmount,
                selectedSide: secilenAt
            }


            const res = await fetch('/api/game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formInputs)
            })
            const data = await res.json()
            if (data.message === 'Success') {
                alert('You have successfully placed your bet')
            } else {
                alert('You have already placed a bet')
            }

        } else {
            alert('You need to login to place a bet')
        }
    }
    */


    /////const { contract, isLoading, error } = useContract("{{contract_address}}");

    /*
    const { contract, error } = useContract(myNftDropContractAddress);
    */

    ////const placeBet = async (cntr: any) => {

    const placeBet = async () => {

        if (user) {

            
            if (betAmount > user?.deposit) {
              //return alert('You dont have enough money to bet this amount');

              setErrMsgSnackbar("You don't have enough money to bet this amount");
              setErr(true);
              return;
            }

            if (betAmount === 0) {
              //return alert('You need to enter a bet amount');

              setErrMsgSnackbar("You need to enter a bet amount");
              setErr(true);
              return;
            }

            if (betAmount < 0) {
              //return alert('You cannot bet a negative amount');

              setErrMsgSnackbar("You cannot bet a negative amount");
              setErr(true);
              return;
            }
            

            ////if (secilenAt === null) return alert('You need to select long or short to bet');

            if (secilenAt === null) {
              setErrMsgSnackbar("You need to select long or short to bet");
              setErr(true);
              return;
            }




            if (betAmount > 50000) {

                //alert("You can't bet more than 50000");
                setErrMsgSnackbar("You can't bet more than 50000");
                setErr(true);

                return;
            }

            if (betAmount < 100) {
                //alert("You can't bet less than 100");
                setErrMsgSnackbar("You can't bet less than 100");
                setErr(true);
                return;
            }

    


            console.log("user img", user?.img);
            console.log("user username", user?.username);
            console.log("betAmount", betAmount);
            console.log("secilenAt", secilenAt);

            //user.username = "creath.park@gmail.com";

           
            
            const formInputs = {
                method: 'newGame',
                API_KEY: process.env.API_KEY,
                userToken: getCookie('user'),
                img: user?.img,
                username: user?.username,
                betAmount: betAmount,
                selectedSide: secilenAt
            }
            const res = await fetch('/api/game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formInputs)
            });

            const data = await res.json();
            if (data.message === 'Success') {
                //alert('You have successfully placed your bet');

                ////console.log('You have successfully placed your bet');

                //console.log("currentPrice", currentPrice);

                ////setBasePrice(currentPrice);

                setLongShort(secilenAt);
                setMyBetAmount(betAmount);
    

                ///////socket.emit("baseprice", currentPrice);

                socket.emit("start", user?.username);




                // 메타마스크로 처하는 부분
                // 충전방식으로 변경
                /////////cntr.erc721.claim(quantity);

                

                /*
                // Optionally pass in filters to limit the blocks from which events are retrieved
                const filters = {
                  fromBlock: 0,
                  toBlock: "latest",
                }
                const events = await contract.events.getAllEvents(filters);
                console.log(events[0].eventName);
                console.log(events[0].data);
                */


            } else {

                //alert('You have already placed a bet');
                setErrMsgSnackbar("You have already placed a bet");
                setErr(true);

            }
            


        } else {

            ///alert('You need to login to place a bet');
            setErrMsgSnackbar("You need to login to place a bet");
            setErr(true);

        }
    }





  /*
    const [erc20Balance, setErc20Balance] = useState<any>(0)

    const getErc20Balance = async () => {

      const erc20Balance = await sdk.wallet.balance("0x481b39CA8d9Ea8443c32bF2C252232c18D3DDf50");
      setErc20Balance(erc20Balance);

      console.log("erc20Balance", erc20Balance);
      alert("erc20Balance="+erc20Balance);

    }
    */

    useEffect(() => {

      if (hasCookie('user')) {
        ///////getErc20Balance();
      }
    
    }, [])



    
    // code for web3
    /*
    const disconnect = useDisconnect();

    const { contract: nftDrop } = useContract(myNftDropContractAddress);

    const address = useAddress();
    const [quantity, setQuantity] = useState(1);
  
    const { data: contractMetadata } = useContractMetadata(nftDrop);
  
    const claimConditions = useClaimConditions(nftDrop);
  
    const activeClaimCondition = useActiveClaimConditionForWallet(
      nftDrop,
      address || ""
    );
    const claimerProofs = useClaimerProofs(nftDrop, address || "");
    const claimIneligibilityReasons = useClaimIneligibilityReasons(nftDrop, {
      quantity,
      walletAddress: address || "",
    });
    const unclaimedSupply = useUnclaimedNFTSupply(nftDrop);
    const claimedSupply = useClaimedNFTSupply(nftDrop);
  
    const numberClaimed = useMemo(() => {
      return BigNumber.from(claimedSupply.data || 0).toString();
    }, [claimedSupply]);
  
    const numberTotal = useMemo(() => {
      return BigNumber.from(claimedSupply.data || 0)
        .add(BigNumber.from(unclaimedSupply.data || 0))
        .toString();
    }, [claimedSupply.data, unclaimedSupply.data]);
  
    const priceToMint = useMemo(() => {
      const bnPrice = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );
      return `${utils.formatUnits(
        bnPrice.mul(quantity).toString(),
        activeClaimCondition.data?.currencyMetadata.decimals || 18
      )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
    }, [
      activeClaimCondition.data?.currencyMetadata.decimals,
      activeClaimCondition.data?.currencyMetadata.symbol,
      activeClaimCondition.data?.currencyMetadata.value,
      quantity,
    ]);
  
    const maxClaimable = useMemo(() => {
      let bnMaxClaimable;
      try {
        bnMaxClaimable = BigNumber.from(
          activeClaimCondition.data?.maxClaimableSupply || 0
        );
      } catch (e) {
        bnMaxClaimable = BigNumber.from(1_000_000);
      }
  
      let perTransactionClaimable;
      try {
        perTransactionClaimable = BigNumber.from(
          activeClaimCondition.data?.maxClaimablePerWallet || 0
        );
      } catch (e) {
        perTransactionClaimable = BigNumber.from(1_000_000);
      }
  
      if (perTransactionClaimable.lte(bnMaxClaimable)) {
        bnMaxClaimable = perTransactionClaimable;
      }
  
      const snapshotClaimable = claimerProofs.data?.maxClaimable;
  
      if (snapshotClaimable) {
        if (snapshotClaimable === "0") {
          // allowed unlimited for the snapshot
          bnMaxClaimable = BigNumber.from(1_000_000);
        } else {
          try {
            bnMaxClaimable = BigNumber.from(snapshotClaimable);
          } catch (e) {
            // fall back to default case
          }
        }
      }
  
      const maxAvailable = BigNumber.from(unclaimedSupply.data || 0);
  
      let max;
      if (maxAvailable.lt(bnMaxClaimable)) {
        max = maxAvailable;
      } else {
        max = bnMaxClaimable;
      }
  
      if (max.gte(1_000_000)) {
        return 1_000_000;
      }
      return max.toNumber();
    }, [
      claimerProofs.data?.maxClaimable,
      unclaimedSupply.data,
      activeClaimCondition.data?.maxClaimableSupply,
      activeClaimCondition.data?.maxClaimablePerWallet,
    ]);
  
    const isSoldOut = useMemo(() => {
      try {
        return (
          (activeClaimCondition.isSuccess &&
            BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
              0
            )) ||
          numberClaimed === numberTotal
        );
      } catch (e) {
        return false;
      }
    }, [
      activeClaimCondition.data?.availableSupply,
      activeClaimCondition.isSuccess,
      numberClaimed,
      numberTotal,
    ]);
  
    /////console.log("claimIneligibilityReasons", claimIneligibilityReasons.data);
  
    const canClaim = useMemo(() => {
      return (
        activeClaimCondition.isSuccess &&
        claimIneligibilityReasons.isSuccess &&
        claimIneligibilityReasons.data?.length === 0 &&
        !isSoldOut
      );
    }, [
      activeClaimCondition.isSuccess,
      claimIneligibilityReasons.data?.length,
      claimIneligibilityReasons.isSuccess,
      isSoldOut,
    ]);
  
    const isLoading = useMemo(() => {
      return (
        activeClaimCondition.isLoading ||
        unclaimedSupply.isLoading ||
        claimedSupply.isLoading ||
        !nftDrop
      );
    }, [
      activeClaimCondition.isLoading,
      nftDrop,
      claimedSupply.isLoading,
      unclaimedSupply.isLoading,
    ]);
  
    const buttonLoading = useMemo(
      () => isLoading || claimIneligibilityReasons.isLoading,
      [claimIneligibilityReasons.isLoading, isLoading]
    );
  
    const buttonText = useMemo(() => {
      if (isSoldOut) {
        return "Sold Out";
      }
      
      if (canClaim) {
        const pricePerToken = BigNumber.from(
          activeClaimCondition.data?.currencyMetadata.value || 0
        );
        if (pricePerToken.eq(0)) {
          return "Bet (Free)";
        }
        //////////return `Bet (${priceToMint})`;
        return `PLACE BET`;
      }
      if (claimIneligibilityReasons.data?.length) {
        return parseIneligibility(claimIneligibilityReasons.data, quantity);
      }
      if (buttonLoading) {
        return "Checking eligibility...";
      }
  
      return "Claiming not available";
    }, [
      isSoldOut,
      canClaim,
      claimIneligibilityReasons.data,
      buttonLoading,
      activeClaimCondition.data?.currencyMetadata.value,
      //priceToMint,
      quantity,
    ]);
  
    */









    return (
        <>
            <div className='flex flex-col items-center justify-center gap-5 w-full lg:w-2/3 '>
                {/* //? Input amount manuel */}
                <div className='flex items-center w-full md:w-1/2 relative'>
                    <div className='absolute left-3 z-10'> <FaCoins className='fill-yellow-500' /> </div>


                    {user && <button
                        onClick={() => {
                            ////setBetAmount(user?.deposit - 0.00001)
                            setBetAmount(50000)
                        }}
                        className=' w-7 btn-circle absolute left-10 z-10 bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black text-xs'> Max
                        </button>}
                    
                    <input onChange={(e: any) => {

                        if (e.target.value > 50000) {
                          setBetAmount(50000);
                        } else {
                          setBetAmount(e.target.value);
                        }

                    }}
                        value={
                          ///betAmount < 100 ? 100 : (betAmount > 50000 ? 50000 : betAmount)

                          betAmount === 0 ? '' : betAmount
                        }
                        type="number"
                        placeholder='100~50000 CRA'
                        className='input w-full pl-20 text-sm' />
                    <button onClick={() => { setBetAmount(0) }} className='absolute right-5 z-10 btn btn-xs btn-outline border-gray-700'>Clear</button>
                </div>

                {/* //? Miktar Selector Buttons */}
                <div className='grid grid-cols-5 content-center md:flex w-full gap-6 items-center justify-center text-xs text-white'>
                    
                    <button
                        onClick={() => {
                            setBetAmount(parseInt(betAmount) + 100)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border
                          text-xs'>+100</button>
                    
                    <button
                        onClick={() => {
                            setBetAmount(parseInt(betAmount) + 500)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border
                          text-xs'>+500</button>
                    
                    <button
                        onClick={() => {
                            setBetAmount(parseInt(betAmount) + 1000)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border
                          text-xs'>+1000</button>
                

                    <button
                        onClick={() => {
                            setBetAmount(parseInt(betAmount) * 2)
                        }}
                        className=' btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border
                          text-xs'>x2</button>
                    
                    <button
                        onClick={() => {
                            setBetAmount(parseInt(betAmount) / 2)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border
                          text-xs'>/2</button>
                    
            
                </div>
                
                {/* //? Horse Select Buttons */}
                <div className='flex flex-col md:flex-row items-center justify-center w-full md:justify-around gap-3'>

                    <button onClick={() => { setSecilenAt(Horses.Horse1) }}
                        className={`btn hidden md:block border text-center text-xl border-white text-white p-1 bg=[#333541] btn-xl w-80 h-16 ${secilenAt === Horses.Horse1 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                    >
                        {Horses.Horse1}
                    </button>

                    <button onClick={() => { setSecilenAt(Horses.Horse2) }}
                        className={`btn hidden md:block border text-center text-xl border-white text-white p-1 bg=[#333541] btn-xl w-80 h-16 ${secilenAt === Horses.Horse2 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                    >
                        {Horses.Horse2}
                    </button>

                    <div className="space-x-10 md:hidden">

                        <button onClick={() => { setSecilenAt(Horses.Horse1) }}
                        
                            //className={`btn border text-center text-xl border-white text-white p-1 bg=[#333541] btn-xl w-28 h-16 ${secilenAt === Horses.Horse1 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                            
                            className={`btn border text-center text-xl border-green-500 text-green-500 p-1 bg=[#333541] btn-xl w-28 h-14 ${secilenAt === Horses.Horse1 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                        >
                            {/*
                            {Horses.Horse1} x {horse1}
                    */}

                            {Horses.Horse1}

                        </button>
                        <button onClick={() => { setSecilenAt(Horses.Horse2) }}
                            className={`btn border text-center border-red-600 text-xl text-red-600 p-1 bg=[#333541] btn-xl w-28 h-14 ${secilenAt === Horses.Horse2 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                        >
                            {/*
                            {Horses.Horse2} x {horse2}
                */}

                            {Horses.Horse2}

                        </button>

                    </div>

{/*
                    <button onClick={() => { setSecilenAt(Horses.Horse3) }}
                        className={`btn hidden md:block border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse3 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                    >{Horses.Horse3} x{horse3}</button>
                    <button onClick={() => { setSecilenAt(Horses.Horse4) }}
                        className={`btn hidden md:block border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse4 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                    >{Horses.Horse4} x{horse4}</button>
                    <div className="space-x-10 md:hidden">
                        <button onClick={() => { setSecilenAt(Horses.Horse3) }}
                            className={`btn border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse3 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                        >{Horses.Horse3} x{horse3}</button>
                        <button onClick={() => { setSecilenAt(Horses.Horse4) }}
                            className={`btn border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse4 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                        >{Horses.Horse4} x{horse4}</button>
                    </div>
                    <button onClick={() => { setSecilenAt(Horses.Horse5) }}
                        className={`btn border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse5 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                    >{Horses.Horse5} x{horse5}</button>
*/}


                </div>

                
                <button onClick={placeBet} className='btn btn-success mt-1 w-full'>Place Bet</button>


{/*
                <Web3Button
                
                        className='btn btn-success mt-1 w-full'
                        contractAddress={nftDrop?.getAddress() || ""}
                        action={
                            (cntr) => {
                               
                              placeBet(cntr);

                                /////cntr.erc721.claim(quantity);
                            }
                        }
                        isDisabled={!canClaim || buttonLoading}
                        onError={(err) => {
                          console.error(err);
                          console.log("err", err);
                          alert("Error betting");
                        }}
                        onSuccess={() => {
                          setQuantity(1);

                          console.log("Successfully betting");
                          //alert("Successfully betting");

                          //placeBet();

                        }}
                        
                      >
                        {buttonLoading ? "Loading..." : buttonText}
                </Web3Button>


                <button onClick={disconnect} className='btn mt-3 w-full'>Disconnect</button>
*/}

            </div>



            <Stack spacing={2} sx={{ width: "100%" }}>
              <Snackbar
                open={succ}
                autoHideDuration={6000}
                onClose={handleCloseSucc}
              >
                <Alert
                  onClose={handleCloseSucc}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  {successMsgSnackbar}
                </Alert>
              </Snackbar>
              <Snackbar open={err} autoHideDuration={6000} onClose={handleCloseErr}>
                <Alert
                  onClose={handleCloseErr}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {errMsgSnackbar}
                </Alert>
              </Snackbar>
          </Stack>



        </>
    )
}
