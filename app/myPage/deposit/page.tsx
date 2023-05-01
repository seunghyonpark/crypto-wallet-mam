"use client";
import { getCookie, hasCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Web3 from "web3";
import abi from "@/public/abi.json";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Stack, Snackbar, Alert } from "@mui/material";

import Coin from "@/libs/enums/coin.enum";
import API from "@/libs/enums/API_KEY";
import { IUser } from "@/libs/interface/user";
import DomainEnum from "@/libs/enums/domain";
import Link from 'next/link';

import { useQRCode } from 'next-qrcode';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';



import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import axios from 'axios';

import ModalAlert from '@/components/ModalAlert';


import dynamic from "next/dynamic";

const CC = dynamic(() => import("@/components/copy-clipboard").then(mod => mod.CopyClipboard), { ssr: false })




export default function Deposit() {

  const MySwal = withReactContent(Swal);

  const [errMsg, setErrMsg] = useState<String>();

  const [wallet, setWallet] = useState<any>(null);

  const router = useRouter();

  const [succ, setSucc] = React.useState(false);
  const [err, setErr] = React.useState(false);
  const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
  const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");

  const [waiting, setWaiting] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();
  const [settings, setSettings] = useState<any>();
  
  const [mobileNumber, setMobileNumber] = useState<any>(null);
  const [authCodeState, setAuthCodeState] = React.useState(false);
  const [authCode, setAuthCode] = useState<any>(null);

  const { Canvas } = useQRCode();


  const [showModal, setShowModal] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);

  


  function onCheck(e: any) {
    const checked = e.target.checked;
    if (checked) {
        setIsDisabled(false)
    }
    if (!checked) {
        setIsDisabled(true)   
    }
  }

  const [miktar, setMiktar] = useState<any>("");



  const getUser = async () => {
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
  }
  
  const getSettings = async () => {
    const res = await fetch(DomainEnum.address + '/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: "get",
        API_KEY: process.env.API_KEY,
      }),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    if (data.status === false) {
      return
    } else {
      setSettings(data.settings[0]);
    }
  }


  useEffect(() => {
    getUser();
    getSettings();
  }, [])

 


  const paraCek = async () => {

    ////let miktar = (document.getElementById("withdraw") as HTMLInputElement).value;

    if (parseInt(miktar) < 1000) {
        setErrMsgSnackbar("Please enter a value greater than 1000");
        setErr(true);
        return;
    } else if (parseInt(miktar) > 10000) {
        setErrMsgSnackbar("Please enter a value less than 10000");
        setErr(true);
        return;
    }
    setWaiting(true);
    const res = await fetch('/api/paymentRequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        method: "new",
        API_KEY: process.env.API_KEY,
        userToken: getCookie("user"),
        email1: user?.email,
        withdrawAmount: miktar,
        walletTo: wallet,
        type: settings?.requestType
        
        })
    });

    const data = await res.json();

    if (data.status === false) {
        setErrMsgSnackbar(data.message);
        setWaiting(false);
        setErr(true);
    } else {
        getUser();
        setWaiting(false);
        setSucc(true);
        setSuccessMsgSnackbar("Your request has been sent successfully");

    }

  };


  


  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3">
        <p>Loading...</p>
      </div>
    )
  }
  

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




  const sendAuthCode = async () => {

    if (!mobileNumber) {
        setErrMsgSnackbar("Mobile Number is required");
        handleClickErr();

        return;
    }

    const formInput = {
        method: 'sendAuthCode',
        API_KEY: process.env.API_KEY,
        userToken: getCookie("user"),
        mobileNumber: mobileNumber,
    };
    fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInput),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.data) {

          setSuccessMsgSnackbar(data.message);
          handleClickSucc();

            setAuthCodeState(true);

        } else {

          setErrMsgSnackbar(data.message);
          handleClickErr();

        }

    });

  }



  const updateWalletAddress = async () => {

    if (!mobileNumber) {
        setErrMsgSnackbar("Mobile Number is required");
        handleClickErr();

        return;
    }

    if (!authCode) {
        setErrMsgSnackbar("Auth Code is required");
        handleClickErr();

        return;
    }

    const formInput = {
        method: 'updateWalletAddress',
        API_KEY: process.env.API_KEY,
        userToken: getCookie("user"),
        authCode: authCode,
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

          setSuccessMsgSnackbar(data.message);
          handleClickSucc();

        } else {

          setErrMsgSnackbar(data.message);
          handleClickErr();

        }

    });

  }






  return (

    <>

      {waiting ? (
        <div
          className="flex absolute min-w-full min-h-full bg-black/70 justify-center items-center "
        >please wait...
        </div>
      ) : null}


      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3 p-10 text-gray-100">
        <h3 className="text-center">Deposit And Withdraw</h3>

      {/*
        <p className="text-center">
          Swap your BNB to {Coin.name} and start earning
        </p>
      */}


        <p className=" text-lg text-center">
          
          {/*
          Dear <span className="text-amber-500">{user.username}</span> you have{" "}
      */}

          <span className="text-[#BA8E09]">{Number(user?.deposit).toFixed(0)}</span>{" "}
          <span className="text-red-500  ">{Coin.name} </span>
          
          {/*
          and
          <span className="text-pink-500"> {((user.maticBalance).toString()).slice(0, 6)} BNB </span>
          */}
          
          in your account
        </p>
        <div className="p-2 grid grid-cols-1 lg:grid-cols-2 w-full lg:w-2/3 gap-5">

          
          {/* //? Matic Deposit  */}
          <div className="w-full border rounded-lg flex flex-col items-center justify-top  gap-5 p-2 py-5">

            <h4 className=" ">
              Deposit <span className="text-sm text-red-500">(CRA)</span>{" "}
            </h4>

            <div className='w-full max-w-xs  '>

              <input
                  ///type="number"
                  placeholder="Wallet Address"
                  id="deposit"
                  ///value={depositCount}
                  value={user?.walletAddress}

                  //onChange={(e) => {
                  //    setDepositCount(e.target.value);
                  //}}

                  className="input input-bordered w-full max-w-xs text-gray-800 text-xl font-bold mb-1"
              />


              {!user?.walletAddress &&

                    <div className="w-full items-center justify-center text-gray-800">
                      <span className="text-sm text-red-500">You need to authorize your phone number.</span>

                    

                      <PhoneInput
                        country={'us'}
                        value={mobileNumber}
                        onChange={phone => setMobileNumber(phone)}
                        />

                        {authCodeState ?

                        <div className=" w-full flex flex-row gap-5 mt-5 ">
                            <input type="number" placeholder="Auth Code" id="authCode" onChange={(e) => {
                                setAuthCode(e.target.value);
                            }} className="input input-bordered w-full max-w-xs text-gray-800 mb-5" />

                            <Button variant="contained" color="primary" className=" l " onClick={() => {
                                updateWalletAddress();
                            }}> Verify </Button>
                        </div>

                        :

                        <Button
                            variant="contained" color="primary" 
                            className=" mt-5"
                            onClick={() => {
                                sendAuthCode();

                            }}
                        >
                            Send Auth Code
                        </Button>

                        } 



                  </div>


              }

            </div>

            {user?.walletAddress &&
                <>
                    <div className='w-full flex flex-row items-center justify-center centent-center'>
                      {/*
                        <CC content={user?.walletAddress}/>
*/}

                        <Button
                          color="success" variant='contained' className='bg-green-500'
                          onClick={() =>
                            {
                              navigator.clipboard.writeText(user?.walletAddress);
                              setSucc(true);
                              setSuccessMsgSnackbar("Your deposit wallet address [" + user?.walletAddress + "] copied to clipboard");
                            }
                          }
                      >
                          Copy
                      </Button>


                    </div>

                    <div className='w-full flex flex-row items-center justify-center centent-center'>
                        <Canvas
                        text={user?.walletAddress}
                        options={{
                        level: 'M',
                        margin: 3,
                        scale: 4,
                        width: 200,
                        color: {
                            dark: '#010599FF',
                            light: '#FFBF60FF',
                        },
                        }}
                        />
                    </div>
                </>
            }


              {/*
                    <button
                      className="mt-6 p-4 bg-active hover:opacity-90 rounded text-primary font-bold inline-flex"
                      onClick={() => getQrcode()}
                    >
                      Generate QR Code
                    </button>

              */}


            {/*
            <button
              onClick={() => {
                paraYatir();
              }}
              className="btn btn-success max-w-xs w-full "
            >
              Deposit
            </button>
            */}

            <span className="ml-5 mr-5 content-center text-sm text-green-500 text-center">
              If you send coins to your wallet address, it will be processed automatically.
            </span>
      
            <Link 
              href={"/myPage/depositRequests"}
              className="  hover:opacity-50 ">
                List of Deposit Requests
            </Link>

          </div>

          

          {/* //? Matic Withdraw */}
          <div className="w-full border rounded-lg flex flex-col items-center justify-top gap-5 p-2 py-5">
            <h4 className=" ">
              Withdraw <span className="text-sm text-red-500">(CRA)</span>

            {/*  
              <span className="text-sm text-green-500">{`(${settings?.requestType === 'Matic' ? "BNB" : Coin.name})`}</span>{" "}
          */}
            </h4>


            <input
              placeholder="Wallet Address"
              onChange={(e) => {
                setWallet(e.target.value);
              }}
              className="input input-bordered w-full max-w-xs text-gray-800"
            />

{/*
            <input
              type="number"
              placeholder="Minimum 1,000"
              id="withdraw"
              className="input input-bordered w-full max-w-xs text-gray-800"
            />
            */}

            <div className='w-full max-w-xs relative'>

              <input
                  placeholder="Minimum 1,000"
                  id="withdraw"
                  value={miktar}
                  className="input input-bordered w-full max-w-xs text-gray-800"
                  onChange={(e) => {
                      setMiktar(e.target.value);
                  }}
              />

              <span className='absolute top-3 right-20 z-5 text-red-500'>CRA</span>

              <button
                  onClick={() => {
                      user?.deposit && user?.deposit > 10000 ? setMiktar("10000") : setMiktar(user?.deposit)
                  }}
                  className='absolute top-3 right-5 z-5 btn btn-xs text-yellow-500 border-yellow-500 hover:bg-white bg-white '
              >
                  Max
              </button>

            </div>



            <div className="ml-5 mr-5 content-center text-sm text-green-500">
                Withdraw amount is at least <br></br>1,000 ~ maximum 10,000 <span className="text-red-500">CRA</span> at a time
            </div>

            <div className="ml-5 mr-5 content-center text-sm text-white">
                * Withdraw Fee <span className="text-lg font-bold">50</span> <span className="text-red-500">CRA</span>
            </div>
            <div className="ml-5 mr-5 content-center text-sm text-white">
                Receive Amount <span className="text-lg font-bold">{ miktar === "" || miktar < 1000 ? 0 : miktar - 50 }</span> <span className="text-red-500">CRA</span>
            </div>
 

            <button
              onClick={
                  //paraCek
                  () => setShowModal(!showModal)
              }
              className="btn btn-accent max-w-xs w-full">
                  Withdraw
            </button>


            <Link href={"/myPage/withdrawRequests"} className="hover:opacity-50">
                List of Withdraw Requests
            </Link>

          </div>

          {/* //? Swap Matic to Coin */}
          {/*
          <div className="w-full border rounded-lg flex flex-col items-center p-2 justify-center gap-5 py-10">
            <h4 className=" ">
              Swap <span className="text-xs ">(BNB to {Coin.name})</span>{" "}
            </h4>
            <p className="text-xs "> 1 MATIC = x{Coin.katSayi} {Coin.name} </p>
            <input
              type="number"
              placeholder="Type here"
              id="swapToCoin"
              className="input input-bordered w-full max-w-xs text-gray-800"
            />
            <button onClick={swapToCoin} className="btn btn-primary max-w-xs w-full">Swap to {Coin.name}</button>
          </div>
          */}


          {/* //? Swap Coin to Matic */}
          {/*
          <div className="w-full border rounded-lg flex flex-col items-center p-2 justify-center gap-5 py-10">
            <h4 className=" ">
              Swap <span className="text-xs ">({Coin.name} to MATIC)</span>{" "}
            </h4>
            <p className="text-xs "> 1 {Coin.katSayi} {Coin.name} = 1/{Coin.katSayi} BNB </p>
            <input
              type="number"
              placeholder="Type here"
              id="swapToMatic"
              className="input input-bordered w-full max-w-xs text-gray-800"
            />
            <button onClick={swapToMatic} className="btn btn-secondary max-w-xs w-full">Swap to BNB</button>
          </div>
          */}

        </div>
      </div>



          <ModalAlert
              show={showModal}
              onClose={() => setShowModal(false)}   
            >

            <div className="w-full flex flex-col items-center justify-center gap-1 ">


            <div className="w-full  rounded-lg flex flex-col items-center justify-center p-4 gap-5 py-0">



                <h3 className="mt-5 text-red-600">NOTICE</h3>

                <div className="text-sm">
                    <div className='text-white'>
                    Requested CRA withdrawal is processed sequentially once a week.
                    </div>

                    <br></br>

                    <div className="text-yellow-400 text-left">
                    (Platform Withdrawal fee Policy 
                    </div>
                    <div className="text-yellow-400 text-right">
                    = Charged a fee)
                    </div>

                </div>

                <div className='flex flex-row items-center font-white'>
                    <input
                        type="checkbox"
                        //defaultChecked={selectedUser?.gonderildi}
                        id='isPay'
                        className="checkbox checkbox-primary"
                        onChange={(e:any) => onCheck(e)}
                        />
                    <p className="pl-3 text-sm text-white">I Agree with the Policy</p>
                </div>

                <button
                    //disabled={isDisabled}
                    onClick={() => {
                        if (isDisabled) {
                            setErrMsgSnackbar("Please check the box to continue");
                            setErr(true);

                        } else {
                            setShowModal(false);
                            paraCek();
                        }
                    }}
                    className="btn btn-success max-w-xs w-full text-xl bg-color-#66CDAA hover:bg-color-#66CDAA  text-white font-bold py-2 px-4 rounded-md"
                >
                WITHDRAW
                </button>
                <button
                    onClick={() => {
                        setShowModal(false);

                        
                    }}
                    className="btn btn-success max-w-xs w-full text-xl bg-color-#66CDAA hover:bg-color-#66CDAA  text-white font-bold py-2 px-4 rounded-md"
                >
                CANCEL
                </button>


                </div>



            </div>

          </ModalAlert>



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

