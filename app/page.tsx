'use client';

///import SocketEnum from '@/libs/enums/socket';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

//@ts-ignore
////import { io } from "socket.io-client";

import API from '@/libs/enums/API_KEY';
import { IUser } from '@/libs/interface/user';
import { getCookie, hasCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';


import Link from 'next/link';



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


import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";


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
  import { parseIneligibility } from "@/utils/parseIneligibility";
  
  ///import Modal from '@/components/Modal';


  // Put Your NFT Drop Contract address from the dashboard here
  //const myNftDropContractAddress = "0x90E2dD8C48cA35534Dd70e3eC19B362cdf71981E";
  
  const myNftDropContractAddress = "0x327dA22b2bCdfd6F4EE4269892bd39Fe6c637BcC";
  
  



// Bebas Neue


export default function Home() {

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
    
    const MySwal = withReactContent(Swal);

    const router = useRouter();

    const [craUsdt, setCraUsdt] = useState<any>();

    const [user, setUser] = useState<IUser>();


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
      const data = await res.json();

      setUser(data?.user?.user);
      
  }

  useEffect(() => {
    if (hasCookie("user") && !user) {

        getUser()
        
    }
  }, [user]);


    
  /*
    useEffect(() => {

      const socketIo = io(`${SocketEnum.id}`, {
        transports: ["websocket"],
      });

      socketIo.on("connect", () => {

        console.log("Landing connect");

        console.log("Landing userToken", getCookie('user'));

       
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
              
              setUsername(user?.user?.user?.username);

              socketIo.emit("user", user?.user?.user?.username);

          })();

        }


      });

      socketIo.on('status', (data: any) => {
          console.log(socketIo.id + " Landing status", data);

          setStatus(data);


          //setStatus(true);
      });




      socketIo.on('horse1Orana', (data: any) => {
          console.log("Landing horse1Orana", data);
          setHorse1Oran(data)
      });

      socketIo.on('horse2Orana', (data: any) => {
          console.log("Landing horse2Orana", data);
          setHorse2Oran(data)
      });
  
      
      socketIo.on('price', (data: any) => {

          setCurrentPrice(data.price);

      });


      socketIo.on('cra_usdt', (data: any) => {
        ///console.log(socket.id + " cra_usdt price", data[0]?.ticker?.latest);

        setCraUsdt(data[0]?.ticker?.latest);
        


      });



      socketIo.on('logout', (data: any) => {
        console.log(socketIo.id + " Landing logout", data);

        
        socketIo.disconnect();

      });
      


      setSocket(socketIo);
    
    /////}, [router]);
    }, []);
    */

        
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








  const [showModal, setShowModal] = useState(false);


    
    return (
        <>

          <header>
              <Navbar />
          </header>


          <div className='flex flex-col w-full h-full items-center justify-center relative
          p-5
          bg-repeat bg-contain bg-gray-800
          '>


{/*

              <div className="bg-center bg-no-repeat bg-contain bg-[url(/back.svg)] h-full w-full ">
                  <div className=" flex flex-col items-center justify-center
                    md:gap-14 md:py-10 bg-gradient-radial
                    from-transparent via-[#0C0E1A] to-transparent bg-blend-difference
                    h-full md:px-60 mt-5">

                    <div
                        className={`flex items-center justify-center text-base  bg-black rounded-md h-[36px] text-center px-5 text-[#BA8E09] border border-[#BA8E09] mt-3`}
                    >
                        <span className="text-[#ffffff] text-sm">PRICE (MAM):</span>&nbsp;&nbsp;&nbsp;
                        <span className="text-sm">{Number(craUsdt).toFixed(2)}&nbsp;&nbsp;&nbsp;</span>
                        <span className="text-[#ffffff] text-sm">USDT</span>
                    </div>
                </div>

            </div>

            */}




<div className="
  w-[350px]
  lg:w-[800px]

  items-center justify-top
  bg-black
  ">

          <div className="
            w-[350px]
            lg:w-[800px] 
            relative ">

            <div className="
              w-[350px]
              lg:w-[800px]
              h-[120px] flex flex-col items-left justify-start
              rounded-b-xl
              bg-gray-900
              ">

              <div className="w-full flex flex-col m-5 items-left  gap-0 text-2xl text-green-500 font-bold ">
                MAM TECH<b></b>
                Metaverse Wallet
              </div>

            </div>



          </div>


</div>


<div className="w-[350px] h-[300px] mt-16 p-5 items-left justify-end">

  <Image
    src="/metaverse.png"
    alt="Picture of the author"
    width={350}
    height={120}
  />

</div>

        </div>

        <footer>
            <Footer />
        </footer>


        </>

    )
}
