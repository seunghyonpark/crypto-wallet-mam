'use client';

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


export default function Landing() {

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

    const { push } = useRouter();

    
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
              
              setUsername(user.user.user.username);

              socketIo.emit("user", user.user.user.username);

          })();

        }


      });

      socketIo.on('status', (data: any) => {
          console.log(socketIo.id + " Landing status", data);

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
          console.log("Landing time", data);
          setTime(data)
      });
      */


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

    
    setTimeout(() => {
      push( '/' );
    }, 10000);

  });




  const [showModal, setShowModal] = useState(false);


    
    return (
        <>

          <div className='flex flex-col w-full h-full items-center justify-center relative
         
          p-5


          bg-[url(/landing_background.jpg)] bg-repeat bg-contain 

          '>      

          <h3 className='text-xl text-green-500 mb-10'>
          The main address of the website is
to https://craclegamez.io/
moved.
It moves automatically after 10 seconds.
            
          </h3>

          <button
            onClick={() => {
              ////paraYatir();

              push( '/' );
            }}
            className="btn btn-success max-w-xs w-full text-xl bg-color-#66CDAA hover:bg-color-#66CDAA  text-white font-bold py-2 px-4 rounded-full"
          >
            GO HOME
          </button>

          <Image
            src="/rabbit1.gif"
            alt="Picture of the author"
            width={100}
            height={100}
            className='mt-10'
          />
          <Image
            src="/rabbit2.gif"
            alt="Picture of the author"
            width={100}
            height={100}
            className='mt-10'
          />



        </div>


        </>

    )
}
