'use client';
import API from '@/libs/enums/API_KEY';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridColDef, GridValueGetterParams, DataGrid, GridApi, GridCellValue } from '@mui/x-data-grid';
import { hasCookie, getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import Image from "next/image";
import Link from 'next/link';
import { AiOutlineUser } from "react-icons/ai";

import axios from 'axios';
import Punklist from "@/components/Punklist/Punklist";


import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { IUser } from "@/libs/interface/user";

import {isMobile} from 'react-device-detect';

import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { updateNftWalletAddress } from '@/libs/models/user';

import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});






export default function Mynft() {

    const [requests, setRequests] = useState<any>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState<any>();

    const MySwal = withReactContent(Swal);

    const [metamusk, setMetaMask] = useState<boolean>(false);
    const [wallet, setWallet] = useState<any>(null);
    const [networkName, setNetworkName] = useState<any>(null);
    const [network, setNetwork] = useState<any>(false);
    const [metamaskview, setMetamaskView] = useState<boolean>(false);


    const [user, setUser] = useState<IUser>();
    const [nftWallet, setNftWallet] = useState<any>(null);;


    // Data from OpenSea
    const [punkListData, setPunkListData] = useState([]);
    const [selectedPunk, setSelectedPunk] = useState(0);

    const [nfts, setNfts] = useState<any>();
    const [selectedNft, setSelectedNft] = useState<any>();

    const [waiting, setWaiting] = useState<boolean>(false);


    const [succ, setSucc] = useState(false);
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState<String>("");
    const router = useRouter();

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


    const columns: GridColDef[] = [
        {
            field: "date",
            headerName: "DATE",
            align: "center",
            headerAlign: "center",
            width: 70,
            type: "dateTime",
            minWidth: 100,
            valueFormatter: (params) => {

                var date = new Date(params.value);
                //.toLocaleString();

                return format(date, "HH:mm:ss");

                //return new Date(params.value).toLocaleString();

            }, // burada tarih formatı değiştirilebilir.
        },

        {
            field: "betAmount",
            type: "number",
            headerName: "BET",
            flex: 0.1,
            minWidth: 60,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "basePrice",
            type: "number",
            headerName: "ENTRY",
            flex: 0.1,
            minWidth: 80,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "prizeAmount",
            type: "number",
            headerName: "RESULTS",
            flex: 0.1,
            minWidth: 60,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "selectedSide",
            headerName: "L/S",
            align: "center",
            headerAlign: "center",
            flex: 0.2,
            minWidth: 100,
            /*
            renderCell(params) {
                return <Chip label={`${params.value}  ${params.row.type}`} color="primary" />;
            },
            */
            
        },

        /*
        {
            field: "winnerHorse",
            headerName: "Result",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
            minWidth: 100,

        },
        */



        /*
        {
            field: "action",
            headerName: "Edit",
            align: "center",
            headerAlign: "center",
            sortable: false,
            width: 125,
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation(); // don't select this row after clicking

                    const api: GridApi = params.api;
                    const thisRow: Record<string, GridCellValue> = {};

                    api
                        .getAllColumns()
                        .filter((c) => c.field !== "__check__" && !!c)
                        .forEach(
                            (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                        );

                    return duzenle(params.row);
                };
                return (
                    <Button color="success" variant='contained' className='bg-green-500' onClick={onClick}>
                        Edit
                    </Button>
                );
            },
        },
        */

    ];

    function duzenle(e: any) {
        setSelectedUser(e)
        handleClickOpen()
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const requestAccepted = async () => {
        let hash = (document.getElementById("hash") as HTMLInputElement).value;
        let isPay = (document.getElementById("isPay") as HTMLInputElement).checked;

        const formInputs = {
            method: "update",
            _id: selectedUser.kayitId,
            userToken: selectedUser.userToken,
            txHash: hash,
            status: hash.length > 3 && isPay ? "Accepted and Paid" : isPay ? "Accepted" : "Waiting",
            gonderildi: isPay,
            API_KEY: process.env.API_KEY,
        }
        const res = await fetch('/api/bethistory', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formInputs)
        })
        const data = await res.json()
        handleClose()
        getAll()
    }

    const requestRejected = async () => {

        let isPay = false;
        let hash = "empty";
        let status = "Rejected"

        const formInputs = {
            method: "reject",
            _id: selectedUser.kayitId,
            userToken: selectedUser.userToken,
            txHash: hash,
            status: status,
            gonderildi: isPay,
            API_KEY: process.env.API_KEY,
        }
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formInputs)
        })
        const data = await res.json()
        handleClose()
        getAll()
    }

    const deleteRequest = async () => {
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "delete",
                API_KEY: process.env.API_KEY,
                _id: selectedUser.kayitId,
            }),
        })
        const data = await res.json()
        handleClose()
        getAll()
    }

    const getAll = async () => {
        const res = await fetch('/api/bethistory', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "getAll",
                API_KEY: process.env.API_KEY,
                userToken: getCookie("user")
            }),
        })
        const data = await res.json();

        setRequests(data.betHistory)
    }

    const getUser = async () => {
      if (hasCookie("user")) {
          const inputs = {
              method: 'getOne',
              API_KEY: API.key,
              userToken: getCookie('user')
          }
          const res = await fetch('/api/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(inputs)
          })
          const user = await res.json()
          setUser(user.user.user)

          setNftWallet(user.user.user.nftWalletAddress)
      }
    }



    useEffect(() => {
        getUser();
        getAll();
    }, [])



    useEffect(() => {

      
      setMetaMask(isMetaMaskInstalled());

      checkAccount();

      const { ethereum }: any = window;

      if (metamusk == true) {

        ethereum.on("networkChanged", function (networkId: any) {

          console.log("networkChanged networkId=", networkId);
          

          if (networkId == 97) {
            setNetwork(true);
          } else {
            setNetwork(false);
          }
        });
  
        ethereum.on("accountsChanged", function (accounts: any) {

          console.log("accountsChanged", accounts);

          if (accounts.length !== 0) {

            setWallet(accounts[0]);

          } else {
            setWallet(null);
          }
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


  //? METAMASK
  const isMetaMaskInstalled = () => {
    const { ethereum }: any = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };


  
  const connectWallet = async () => {
    try {
      const { ethereum }: any = window;
      if (!ethereum) {
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });

      ////const ethChainId = "0x13881";

      const ethChainId = "0x61";



      if (chainId !== ethChainId) {

        MySwal.fire({
          title: "Opsss?",
          text: "You are connected to the wrong network!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Change",
          cancelButtonText: "Cancel",
        }).then(async (result: any) => {

          if (result.isConfirmed) {
            try {
              await ethereum
                .request({
                  method: "wallet_switchEthereumChain",
                  ////params: [{ chainId: "0x13881" }],
                  params: [{ chainId: "0x61" }],
                })
                .then(() => {
                  if (ethereum) {
                    ethereum.on("chainChanged", async (chainId: any) => {

                      ///if ((chainId = "0x13881")) {
                      if ((chainId = "0x61")) {

                        const accounts = await ethereum.request({
                          method: "eth_requestAccounts",
                        });
                        setWallet(accounts[0]);
                        setNetwork(true);
                        setNetworkName("BSC Testnet");
                      }
                    });
                  }
                });
            } catch (error: any) {
              if (error.code === 4902) {
                await ethereum
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        ///chainId: "0x13881",
                        chainId: "0x61",

                        ///chainName: "Mumbai Testnet",
                        chainName: "BSC Testnet",

                        nativeCurrency: {
                          ///name: "Mumbai Testnet",
                          name: "BSC Testnet",
                          //symbol: "MATIC", // 2-6 characters long
                          symbol: "BSC", // 2-6 characters long
                          decimals: 18,
                        },
                        //blockExplorerUrls: ["https://polygonscan.com/"],
                        blockExplorerUrls: ["https://testnet.bscscan.com/"],

                        
                        ///rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                        rpcUrls: ["https://binance-testnet.rpc.thirdweb.com"],

                        
                      },
                    ],
                  })
                  .then(() => {
                    if (ethereum) {
                      ethereum.on("chainChanged", async (chainId: any) => {

                        ////if ((chainId = "0x13881")) {

                        if ((chainId = "0x61")) {


                          const accounts = await ethereum.request({
                            method: "eth_requestAccounts",
                          });
                          
                          setWallet(accounts[0]);

                          setNetwork(true);
                          setNetworkName("BSC Testnet");
                        }
                      });
                    }
                  });
              }
            }
          }
        });


      } else {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("accounts", accounts)

        setWallet(accounts[0]);
        setNetwork(true);
        setNetworkName("BSC Testnet");
      }
    } catch (error) { }
  };


  async function wrongWallet() {
    try {
      const { ethereum }: any = window;
      let chainId = await ethereum.request({ method: "eth_chainId" });

      ////if (chainId !== "0x13881") {

      if (chainId !== "0x61") {

        setNetwork(false);
      } else {
        setNetwork(true);
      }
    } catch (e: any) { }
  }

  

  useEffect(() => {
    if (isMetaMaskInstalled()) {
      wrongWallet();

      setInterval(() => {
        connectWallet();
      }, 5 * 1000)
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  

  async function checkAccount() {
    const { ethereum }: any = window;
    if (metamusk == true) {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        
        setWallet(accounts[0]);

      } else {
        setWallet(null);
        //await connectWallet()
      }
    }
  }




  /*
  useEffect(() => {
    if (wallet) {
      //@ts-ignore
       //@ts-ignore
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(Abifile, contractAddress); //@ts-ignore
      setContract(contract);
    }
  }, [Abifile, contractAddress, wallet]);
  */






  useEffect(() => {

    const setNftWalletAddress = async () => {

      console.log("=====================")

      const inputs = {
          method: 'setNftWalletAddress',
          API_KEY: process.env.API_KEY,
          userToken: getCookie('user'),
          walletAddress: wallet,
      }
      const res = await fetch('/api/nft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs)
      })
      const data = await res.json()

      //console.log("data", data);

      //setNftWallet(wallet);
  
    }


    if (wallet) {

      console.log("wallet", wallet)
      console.log("nftWallet", nftWallet)

      if (wallet !== nftWallet) {


        setNftWalletAddress();

      }

    }
  }, [wallet, nftWallet]);




  useEffect(() => {


    const getNFTs = async () => {

      setWaiting(true);

      const res = await fetch('/api/nft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({
              method: "getNftsByWalletAddress",
              API_KEY: process.env.API_KEY,
              walletAddress: nftWallet,
          })
      })
      const data = await res.json()

      ////console.log("NFT message", data.message);
      ////console.log("NFT data", data.data);
     
      if (data.data?.length > 0) {
        setNfts(data.data);

        setSelectedNft(data.data[0]);
      }

      setWaiting(false);

    }

    if (nftWallet !== "0x") {
      getNFTs();
    }

  }, [nftWallet]);





    const rows = requests.map((item: any, i: number) => {
        return {
            kayitId: item._id,
            id: i,
            betAmount: item.betAmount,
            basePrice: item.basePrice,
            prizeAmount: item.prizeAmount,
            selectedSide: item.selectedSide,
            winnerHorse: item.winnerHorse,
            date: item.date,
            userToken: item.userToken,
        }
    })


    const selectNFT = async (asset: any) => {

      setSelectedNft(asset);
	
    };


    const updateProfileImage = async () => {
      console.log("updateProfileImage");

      const formInput = {
          method: 'updateProfileImage',
          API_KEY: process.env.API_KEY,
          userToken: getCookie("user"),
          img: selectedNft,
      };
      fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formInput),
      })
      .then((res) => res.json())
      .then((data) => {
          if (data.user) {

            getUser();
  
            ///alert("Profile image Updated");
       

            setSucc(data.message);
            handleClickSucc();

          } else {

            setErrMsg(data.message);
            handleClickErr()

            ////alert("Profile image Update Failed");
              //setErrMsg(data.message);
              //handleClickErr();
          }
          //todo
          // handleClickSucc();
      });
  
    }


    

    return (
        <>

{/*
      {metamaskview ? (
        <div
          onClick={() => {
            setMetamaskView(false);
          }}
          className="flex absolute min-w-full min-h-full bg-black/70 justify-center items-center "
        >
          <Image
            src="/metamask-fox.svg"
            width={100}
            height={100}
            alt="Metamask"
          />
        </div>
      ) : null}
*/}


<div className='flex flex-row itmes-center justify-center '>


            <div className='w-full p-10 mt-0 text-gray-200 lg:w-[800px] itmes-center justify-center '>



                <div className="w-full border rounded-lg flex flex-col items-center justify-center gap-1 py-5">
                    <h4 className="  text-white text-xl font-bold">
                        My Profile
                    </h4>

                    {user &&
                    <Image
                      src={user?.img}
                      alt="nft"
                      width={200} height={200}
                      className="rounded-md"
                    >
                    </Image>
                    }

                </div>


{nftWallet === "0x" &&



                <div className=" flex flex-col items-center justify-center md:w-1/3 bg-white rounded-lg shadow-md p-4 m-5">

                  <div className="pb-10 space-y-3">
                      <div className="flex gap-2 items-center pl-4">
                          <AiOutlineUser className="fill-green-500 w-5 h-5" />
                          <h2 className="text-gray-500 text-lg">
                              Connect Wallet
                          </h2>
                      </div>
                      <div className="w-full relative h-[1px] border flex items-center justify-center">
                          <div className="absolute bg-green-500 left-0 w-1/3 h-[1px] z-40"></div>
                          <div className="absolute left-1/3  w-2 h-2 rounded-full bg-green-500 z-50"></div>
                      </div>
                  </div>

{/* //todo BU KISIMA METAMASK EKLENİCEK */}

{metamusk == true ? (

    network == true ? (

        wallet ? (
            <Button
              className="w-full text-white text-center justify-center h-500 p-5 items-center bg-[#24252f] hover:bg-[#141111] rounded-md flex flex-col"
              onClick={() => {
                ///setNftWallet(wallet);
                ///updateUserNftWallet();
              }}
              >
                <Image
                    src={"/metamask-fox.svg"}
                    alt="meta-svg"
                    width={100}
                    height={100}
                />
                <h2 className="text-xl">
                    <span className="text-[#f5841f]">Metamask</span> Connected!
                    <p className="text-xs">Wallet: {wallet.slice(0, 5)}...{wallet.slice(wallet.length - 5, wallet.length)}</p>
                </h2>
            </Button>

          
        ) :
            <Button className="w-full text-white text-center justify-center h-500 p-5 items-center bg-[#24252f] hover:bg-[#141111] rounded-md flex flex-col">
                <Image
                    src={"/metamask-fox.svg"}
                    alt="meta-svg"
                    width={100}
                    height={100}
                />
                <h2 className="text-xl">
                    <span className="text-[#f5841f]">Metamask</span> Connect
                </h2>
            </Button>
    ) : (
        <Button className="w-full text-white text-center justify-center h-500 p-5 items-center bg-[#24252f] hover:bg-[#141111] rounded-md flex flex-col">
            <Image
                src={"/metamask-fox.svg"}
                alt="meta-svg"
                width={100}
                height={100}
            />
            <h2 className="text-xl">
                <span className="text-[#f5841f]">Wrong</span> Network
            </h2>
        </Button>
    )
) : (
    <Link target="_blank" href="https://metamask.io/download/" className="w-full text-white text-center justify-center h-500 p-5 items-center bg-[#24252f] hover:bg-[#141111] rounded-md flex flex-col">
        <Image
            src={"/metamask-fox.svg"}
            alt="meta-svg"
            width={100}
            height={100}
        />
        <h2 className="text-xl">
            <span className="text-[#f5841f]">Metamask</span> Install
        </h2>
    </Link>
)}

</div>

}


            {!nfts &&

              <div className='mt-5 text-xl text-yellow-400'>
              Connecting Service will be updated soon!
              </div>
                
            } 


          <div className="w-full border rounded-lg flex flex-col items-center justify-center gap-1 py-5 mt-5">
                    <h4 className="  text-yellow-400 text-xl font-bold">
                        My NFTs
                    </h4>

          </div>


{waiting ? (
  
      <>
        <div
          className="flex mt-10 min-w-full min-h-full justify-center items-center
            text-white text-2xl font-bold"
        >
          Loading NFTs ...


        </div>

        <div
        className="flex mt-5 min-w-full min-h-full justify-center items-center
          text-white text-2xl font-bold"
      >

        <Image
          src="/rabbit_Loading.gif"
          width={100}
          height={100}
          alt="Metamask"
        />

      </div>
        </>

      ) : null}



            <div className="mt-4 grid justify-center gap-5 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-5">

              {nfts?.map((asset:any) => (

                <div key={asset}
                  onClick={() => selectNFT(asset)}
                  className={
                    `${ selectedNft === asset ? 
                      "w-20 h-20 rounded-md border-2 border-yellow-400" : "w-20 h-20 border-2 border-transparent"
                    }`
                  }
                >

                  <Image
                    src={asset}
                    alt="nft"
                    width={200} height={200}
                    className="rounded-md">
                    
                  </Image>
                </div>

              ))}
            
            </div>

            {nfts &&
              <Button
                variant="contained" color="primary" startIcon={<AccountBoxIcon />}
                className=" w-full "
                onClick={() => {
                    ///setShowModal(false), router.push('/gameT2E/help')

                    updateProfileImage()
                }}
                >
                Update My Profile Image
              </Button>
            }




                
                {/*

                {punkListData.length > 0 && (
                  <>
                  
                    <Main selectedPunk={selectedPunk} punkListData={punkListData} />
                  

                    <Punklist
                      punkListData={punkListData}
                      setSelectedPunk={setSelectedPunk}
                    />
                  </>
                )
                */}
                

      

            </div>

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
                        You have successfully updated your profile image!
                    </Alert>
                </Snackbar>
                <Snackbar open={err} autoHideDuration={6000} onClose={handleCloseErr}>
                    <Alert
                        onClose={handleCloseErr}
                        severity="error"
                        sx={{ width: "100%" }}
                    >
                        {errMsg}
                    </Alert>
                </Snackbar>
            </Stack>





        </>
    )
}

