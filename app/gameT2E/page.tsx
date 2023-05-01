'use client';
import BetInputs from '@/components/betHorse/betInputs'
import BetTables from '@/components/betScreen/betTables'
import Son20Oyun from '@/components/betHorse/son20';
import LatestWinners from '@/components/betHorse/latestWinners';
import YuruyenAt from '@/components/betEkrani/yuruyenAt'

import Race from '@/components/yarisEkrani/raceGame';

import SocketEnum from '@/libs/enums/socket';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

//@ts-ignore
import { io } from "socket.io-client";

import API from '@/libs/enums/API_KEY';
import { IUser } from '@/libs/interface/user';
import { getCookie, hasCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';



import axios from 'axios';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import FullScreen from "highcharts/modules/full-screen.js";
import StockTools from "highcharts/modules/stock-tools.js";
import HollowCandleStick from "highcharts/modules/hollowcandlestick.js";




// code for web3
import {
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
  
  import Modal from '../../components/Modal';


  // Put Your NFT Drop Contract address from the dashboard here
  //const myNftDropContractAddress = "0x90E2dD8C48cA35534Dd70e3eC19B362cdf71981E";
  
  const myNftDropContractAddress = "0x327dA22b2bCdfd6F4EE4269892bd39Fe6c637BcC";
  
  



// Bebas Neue


export default function GameT2E() {

    const [status, setStatus] = useState<any>();

    const [time, setTime] = useState<any>(0);

    const [horse1Oran, setHorse1Oran] = useState<any>([]);
    const [horse2Oran, setHorse2Oran] = useState<any>([]);

    const [currentPrice, setCurrentPrice] = useState<any>(0);

    const [basePrice, setBasePrice] = useState<any>(0);
    const [longShort, setlongShort] = useState<any>("Long");
    
    const [myBetAmount, setMyBetAmount] = useState<any>("");

    const [socket, setSocket] = useState<any>();

    const [username, setUsername] = useState<any>();

    const [user, setUser] = useState<IUser>();
    
    const MySwal = withReactContent(Swal);

    const router = useRouter();


    
    useEffect(() => {

      const socketIo = io(`${SocketEnum.id}`, {
        transports: ["websocket"],
      });

      socketIo.on("connect", () => {

        console.log("GameT2E connect");

        console.log("GameT2E userToken", getCookie('user'));

       
        if (hasCookie('user')) {
 
          const inputs = {
            method: 'getOne',
            API_KEY: API.key,
            userToken: getCookie('user')
          };

          (async () => {

              const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
              })
              const user = await res.json();

              setUser(user);
              
              setUsername(user?.user?.user?.username);

              /////console.log("gameT2E user", user.user.user.username);

              socketIo.emit("user", user?.user?.user?.username);

          })();

        }


      });

      socketIo.on('status', (data: any) => {
          console.log(socketIo.id + " GameT2E status", data);

          setStatus(data);

          /*
          if (data === true) {
              setBasePrice(currentPrice);
          }
          */

          //setStatus(true);
      });

      /*
      socketIo.on('time', (data: any) => {
          console.log("GameT2E time", data);
          setTime(data)
      });
      */


      socketIo.on('horse1Orana', (data: any) => {
          console.log("GameT2E horse1Orana", data);
          setHorse1Oran(data)
      });

      socketIo.on('horse2Orana', (data: any) => {
          console.log("GameT2E horse2Orana", data);
          setHorse2Oran(data)
      });
  
      
      socketIo.on('price', (data: any) => {
          ///console.log(socketIo.id + " GameT2E price", data.price);
          setCurrentPrice(data.price);

      });


      socketIo.on('logout', (data: any) => {
        console.log(socketIo.id + " GameT2E logout", data);

        ////deleteCookie('user');
        ///router.push('/gameT2E');

        
        socketIo.disconnect();

      });
      

      /*
      if (socket) {
        socket.disconnect();
      }
      */
      

      setSocket(socketIo);
    
    /////}, [router]);
    }, []);


        
    /*
    useEffect(() => {

      return (() => {
        if (socket) {
          socket.disconnect();
        }
      });

    }, [socket]);
    */



    ////useEffect(() => socketInitializer(), []);


    /*
    const socketInitializer = () => {

        const socket = io(`${SocketEnum.id}`, {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("GameT2E connect");
        });

        socket.on('status', (data: any) => {
            console.log("GameT2E status", data);

            setStatus(data);

            //setStatus(true);
        });

        socket.on('time', (data: any) => {
            console.log("GameT2E time", data);
            setTime(data)
        });

        socket.on('horse1Orana', (data: any) => {
            console.log("GameT2E horse1Orana", data);
            setHorse1Oran(data)
        });

        socket.on('horse2Orana', (data: any) => {
            console.log("GameT2E horse2Orana", data);
            setHorse2Oran(data)
        });
     
        
        socket.on('price', (data: any) => {
            console.log(socket.id + " GameT2E price", data.price);
            
            setCurrentPrice(data.price);

        });


          
    }

    */




    // code for web3
    /*
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
        return `Bet (${priceToMint})`;
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
      priceToMint,
      quantity,
    ]);
    */
  
/*
    if (typeof Highcharts === "object") {
      // init the module
      Indicators(Highcharts);
      DragPanes(Highcharts);
      AnnotationsAdvanced(Highcharts);
      PriceIndicator(Highcharts);
      FullScreen(Highcharts);
      StockTools(Highcharts);
      HollowCandleStick(Highcharts);
    }
*/
    ///const data = [] as any;

    const chartData = [] as any;

    const chartRef = useRef();


    /*

    const [chartOptions, setChartOptions] = useState({


      
        rangeSelector: {
          selected: 1
        },
  
        accessibility: {
          enabled: true
        },
    
        chart: {
          backgroundColor: '#000000',
       },
  
        yAxis: [
          {
            labels: {
              align: "right",
              x: -3
            },
            title: {
              text: "ETH-USD"
            },
            height: "100%",
            lineWidth: 2,
            resize: {
              enabled: true
            }
          },
  
        ],
    
        tooltip: {
          split: true
        },
  
        series: [
          {
            type: "candlestick",
            name: "ETH-USD",
            data: chartData,

          },
  
        ]
      

    });

    */


    if (typeof Highcharts === "object") {
      // init the module
      Indicators(Highcharts);
      DragPanes(Highcharts);
      AnnotationsAdvanced(Highcharts);
      PriceIndicator(Highcharts);
      FullScreen(Highcharts);
      StockTools(Highcharts);
      HollowCandleStick(Highcharts);
    }


    const data = [] as any;

    const [chartOptions, setChartOptions] = useState({

      chart: {
        backgroundColor: '#000000',
      },

      yAxis: [
        {
          height: "80%"
        },
        {
          top: "80%",
          height: "20%",
          offset: 0
        }
      ],

      credits: {
        enabled: false
      },
    
      series: [
        {
          type: "hollowcandlestick",
          name: "ETH-USD",
          data: data
        }
      ]
    });





    /*
  const staticData = [] as any;

  useEffect(() => {

    (async () => {
        
      // [1680076800000,"1805.19","1806.60","1805.18","1806.03","151306",1680076859999,"837.85354498",296,"125620","695.62075315","0"]
startTime=1611619200000

      const response = await axios.get('https://dapi.binance.com/dapi/v1/klines?symbol=ETHUSD_PERP&interval=1m');
      response.data.forEach( (el: any) => {
        staticData.push([el[0],parseFloat(el[1]),parseFloat(el[2]),parseFloat(el[3]),parseFloat(el[4]),parseInt(el[5])])
      })

    })()

    setTimeout(() => {
      setChartOptions({
        series: {
          data: staticData,
        },
      } as any);
    },1000)

  },[staticData]);
*/


///const [chartData, setChartData] = useState<any>();






useEffect(() => {

  let i = 0;

  function pollDOM() {
    console.log(i);
    i++;


    const staticData = [] as any;

    const startTime = Date.now() - 1000 * 60 * 60;

    console.log("startTime", startTime);

    (async () => {
      ////const response = await axios.get('https://dapi.binance.com/dapi/v1/klines?symbol=ETHUSD_PERP&interval=1m&startTime=1680113606000');

      const response = await axios.get('https://dapi.binance.com/dapi/v1/klines?symbol=ETHUSD_PERP&interval=1m&startTime=' + startTime);
      
      
      response.data.forEach( (el: any) => {
        staticData.push([el[0],parseFloat(el[1]),parseFloat(el[2]),parseFloat(el[3]),parseFloat(el[4]),parseInt(el[5])])
      })

    })()

    console.log("staticData", staticData);

    setChartOptions({
      series: {
        data: staticData,
      },
    } as any);

  }

  pollDOM();

  const interval = setInterval(pollDOM, 10000);

  return () => {
    clearInterval(interval);

  }

}, []);


/*
useEffect(() => {

  const staticData = [] as any;

  (async () => {
    const response = await axios.get('https://dapi.binance.com/dapi/v1/klines?symbol=ETHUSD_PERP&interval=1m&startTime=1611619200000');
    
    
    response.data.forEach( (el: any) => {
      staticData.push([el[0],parseFloat(el[1]),parseFloat(el[2]),parseFloat(el[3]),parseFloat(el[4]),parseInt(el[5])])
    })

  })()

  console.log("staticData", staticData);

  setChartData(staticData);

},[]);
*/





  const [showModal, setShowModal] = useState(false);




  useEffect(() => {

    const getGame = async () => {


        const res = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify({
                method: "getGameByUsername",
                API_KEY: process.env.API_KEY,
                username: user?.username,
            })
        })
        const data = await res.json()

        console.log("=====navbar getGame", data);

        if (data.game) {
          setStatus(true);
        } else {
          setStatus(false);
        }
    }

    if (hasCookie("user") && user?.username) {
      getGame();
    }

    

  },[user?.username]);




    
    return (
        <>



            {!status ?
                (
                    <div className='flex flex-col px-10 pb-10 w-full h-full items-center justify-center gap-5 bg-[#0C0E1A] relative'>
                        
                        {/*
                        <LatestWinners />
                

                        <Son20Oyun />
                        */}

                        <div className="bg-center bg-no-repeat bg-contain bg-[url(/back.svg)] h-full w-full ">

                            <div className=" flex flex-col items-center justify-center
                              md:gap-5 md:py-3 bg-gradient-radial
                              from-transparent via-[#0C0E1A] to-transparent bg-blend-difference
                              h-full md:px-6 mt-2">
                                {/*
                                <YuruyenAt time={time} horseSrc={'/at.json'} />
                                */}

{/*
                               <Image src="/realtime-ticking-stock-chart.gif" width={500} height={500} alt="gameT2E" />
*/}



<div className='w-full flex justify-center  '>

<HighchartsReact
  highcharts = { Highcharts }
  constructorType = { "stockChart" } // { "mapChart" }
  options = { chartOptions }
  ///options={options}
  //containerProps={{ style: { height: "250px", width: "350px" } }}
  //containerProps={{ style: { height: "250px", width: "100%", padding: "1px" } }}

  containerProps = {{ className: 'h-[200px] lg:h-[300px] w-full max-w-[650px] m-0 p-[1px] bg-gray-600  ' }}
  //  containerProps = {{ className: 'chartContainer' }}
  immutable = { false }
  allowChartUpdate = { true }
  ///updateArgs = { [true, true, true] }
/>
</div>


                                <div
                                    className={`  flex items-center justify-center text-base  bg-black rounded-md h-[36px] text-center px-5 text-[#BA8E09] border border-[#BA8E09] mt-3`}
                                >
                                   <span className="text-[#ffffff] text-sm">PRICE (ETH):</span>&nbsp;&nbsp;&nbsp;
                                   <span className="text-xl">{Number(currentPrice).toFixed(2)}&nbsp;&nbsp;&nbsp;</span>
                                   <span className="text-[#ffffff] text-sm">USDT</span>
                                </div>


                            </div>

                        </div>


                        


                        <BetInputs
                          socket={socket}
                          horse1={horse1Oran}
                          horse2={horse2Oran}
                          currenPrice={currentPrice}
                          setBasePrice={setBasePrice}
                          setLongShort={setlongShort}
                          setMyBetAmount={setMyBetAmount}
                        />

                        {/*
                        <BetTables />
                            */}




                    </div>



                )
                :
                < Race
                  socket={socket}
                  username={username}
                  currentPrice={currentPrice}
                  betPrice={basePrice}
                />
            }


        </>

    )
}
