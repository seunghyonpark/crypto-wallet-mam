"use client";
import { getCookie, hasCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Web3 from "web3";
import abi from "../../../public/abi.json";
import Image from "next/image";
import { Stack, Snackbar, Alert } from "@mui/material";
import Coin from "@/libs/enums/coin.enum";
import API from "@/libs/enums/API_KEY";
import { IUser } from "@/libs/interface/user";
import DomainEnum from "@/libs/enums/domain";


import { useRouter, useSearchParams } from 'next/navigation';
import { BsTypeH3 } from "react-icons/bs";


export default function Loser() {
  let Abifile: any = abi;
  let contractAddress = "0x46aA314E5ee3c0E5E945B238075d2B5eB2AAA317";
  const MySwal = withReactContent(Swal);
  const [errMsg, setErrMsg] = useState<String>();
  const [metamusk, setMetaMask] = useState<boolean>(false);
  const [wallet, setWallet] = useState<any>(null);
  const [networkName, setNetworkName] = useState<any>(null);
  const [network, setNetwork] = useState<any>(false);
  const [contract, setContract] = useState<any>();
  const [depositCount, setDepositCount] = useState<any>(0);
  const [metamaskview, setMetamaskView] = useState<boolean>(false);
  const [succ, setSucc] = React.useState(false);
  const [err, setErr] = React.useState(false);
  const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
  const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");
  const [waiting, setWaiting] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>()
  const [settings, setSettings] = useState<any>()

  const { push } = useRouter();
  const searchParams = useSearchParams();

  const bet = searchParams.get('bet');
  const betAmount = searchParams.get('betAmount');


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

  useEffect(() => {
    getUser();
  }, [])




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




  return (
    <>


      {waiting ? (
        <div
          className="flex absolute min-w-full min-h-full bg-black/70 justify-center items-center "
        >please wait...
        </div>
      ) : null}

      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3 p-5 text-gray-100">

        <div className="p-2 grid grid-cols-1 lg:grid-cols-1 w-full lg:w-2/3 gap-5 ">

          {/* //? Matic Deposit  */}
          <div className="w-full  rounded-lg flex flex-col items-center justify-center p-2 gap-5 py-0">


{/*
            <h4 className=" ">
              Deposit <span className="text-xs ">(BNB)</span>{" "}
            </h4>
    */}


{/*
            <h3>
              You Lost {betAmount} $CRA
            </h3>
            <h4>
              You Betted {bet}
            </h4>
*/}


            <Image
                //src={`/rabbit${horse.id}.gif`}
                src={`/rabbit_loser_${bet}.gif`}
                width="500"
                height="500"
                alt={"at"}
            />



            <button
              onClick={() => {
                ////paraYatir();

                push( '/gameT2E' );
              }}
              className="btn btn-success max-w-xs w-full text-xl bg-color-#66CDAA hover:bg-color-#66CDAA  text-white font-bold py-2 px-4 rounded-full"
            >
              GO BET
            </button>

            <button
              onClick={() => {
                ////paraYatir();
                push( '/Landing/betHistory' );
              }}
              className="btn btn-success max-w-xs w-full text-xl bg-color-#66CDAA hover:bg-color-#66CDAA  text-white font-bold py-2 px-4 rounded-full"
            >
              BET RESULT
            </button>


          </div>

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
