"use client";
import { getCookie, hasCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Web3 from "web3";
import abi from "../../../../public/abi.json";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Stack, Snackbar, Alert } from "@mui/material";
import Coin from "@/libs/enums/coin.enum";
import API from "@/libs/enums/API_KEY";
import { IUser } from "@/libs/interface/user";
import DomainEnum from "@/libs/enums/domain";




export default function Deposit() {
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
  const router = useRouter();
  const [succ, setSucc] = React.useState(false);
  const [err, setErr] = React.useState(false);
  const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
  const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");
  const [waiting, setWaiting] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>()
  const [settings, setSettings] = useState<any>()

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
    getSettings();
  }, [])

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
    setMetaMask(isMetaMaskInstalled());
    checkAccount();
    const { ethereum }: any = window;
    if (metamusk == true) {
      ethereum.on("networkChanged", function (networkId: any) {
        if (networkId == 97) {
          setNetwork(true);
        } else {
          setNetwork(false);
        }
      });

      ethereum.on("accountsChanged", function (accounts: any) {
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
      const ethChainId = "0x13881";
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
                  params: [{ chainId: "0x13881" }],
                })
                .then(() => {
                  if (ethereum) {
                    ethereum.on("chainChanged", async (chainId: any) => {
                      if ((chainId = "0x13881")) {
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
                        chainId: "0x13881",
                        chainName: "Mumbai Testnet",
                        nativeCurrency: {
                          name: "Mumbai Testnet",
                          symbol: "MATIC", // 2-6 characters long
                          decimals: 18,
                        },
                        blockExplorerUrls: ["https://polygonscan.com/"],
                        rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                      },
                    ],
                  })
                  .then(() => {
                    if (ethereum) {
                      ethereum.on("chainChanged", async (chainId: any) => {
                        if ((chainId = "0x13881")) {
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
      if (chainId !== "0x13881") {
        setNetwork(false);
      } else {
        setNetwork(true);
      }
    } catch (e: any) { }
  }

  useEffect(() => {
    if (isMetaMaskInstalled()) {
      wrongWallet();
      connectWallet();
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

  useEffect(() => {
    if (wallet) {
      //@ts-ignore
       //@ts-ignore
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(Abifile, contractAddress); //@ts-ignore
      setContract(contract);
    }
  }, [Abifile, contractAddress, wallet]);

  const paraYatir = async () => {
    if (depositCount == 0) {
      setErrMsgSnackbar("Please enter a value greater than 0");
      setErr(true);
      return
    } else if (depositCount < 0) {
      setErrMsgSnackbar("Please enter a value greater than 0");
      setErr(true);
      return
    }
    setMetamaskView(true);
    const maticCount = depositCount;
    contract.methods
      .deposit()
      .send({
        from: wallet,
        value: Web3.utils.toWei(depositCount, "ether"),
        gasLimit: 1000000,
      })
      .on("transactionHash", (hash: any) => {
      })
      .on("receipt", (receipt: any) => {
      })
      .on("confirmation", (confirmationNumber: any, receip: any) => {
        if (confirmationNumber == 1) {
          fetch("/api/deposit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              method: "makeMaticDeposit",
              API_KEY: process.env.API_KEY,
              userToken: getCookie("user"),
              amount: parseFloat(maticCount),
            }),
          }).then((res) => res.json())
            .then(data => {
              if (data.message == "Success") {
                setMetamaskView(false);
                getUser();
                setSucc(true);
                setSuccessMsgSnackbar("Transaction successful");
              } else {
                setMetamaskView(false);
                setErrMsgSnackbar("Transaction failed");
                setErr(true);
              }
            })
        }
      })
      .on("error", (error: any) => {
        console.error(error);
        setMetamaskView(false);
        setErrMsgSnackbar("Transaction failed");
        setErr(true);
      });

  };

  const paraCek = async () => {
    let miktar = (document.getElementById("withdraw") as HTMLInputElement)
      .value;
    if (miktar == "0") {
      setErrMsgSnackbar("Please enter a value greater than 0");
      setErr(true);
      return
    } else if (miktar < "0") {
      setErrMsgSnackbar("Please enter a value greater than 0");
      setErr(true);
      return
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
    })
    const data = await res.json()
    if (data.status === false) {
      setErrMsgSnackbar(data.message);
      setWaiting(false);
      setErr(true);
      return
    } else {
      getUser();
      setWaiting(false);
      setSucc(true);
      setSuccessMsgSnackbar("Your request has been sent successfully");
    }
  };

  const swapToCoin = async () => {
    if (user) {
      let miktar = (document.getElementById("swapToCoin") as HTMLInputElement).value;
      setWaiting(true);
      if (miktar == "0") {
        setErrMsgSnackbar("Please enter a value greater than 0");
        setErr(true);
        setWaiting(false);
        return
      } else if (miktar < "0") {
        setErrMsgSnackbar("Please enter a value greater than 0");
        setErr(true);
        setWaiting(false);
        return
      } else if (Number(miktar) > user?.maticBalance) {
        setErrMsgSnackbar("You do not have enough Matic");
        setErr(true);
        setWaiting(false);
        return
      }
      let response = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "swapToCoin",
          API_KEY: process.env.API_KEY,
          userToken: getCookie("user"),
          amount: miktar,
        }),
      });
      let data = await response.json();
      if (data.status === false) {
        setErrMsgSnackbar(data.message);
        setErr(true);
        setWaiting(false);
        return
      } else {
        getUser();
        setWaiting(false);
        setSucc(true);
        setSuccessMsgSnackbar(data.message);
      }
    }
  };

  const swapToMatic = async () => {
    if (user) {
      let miktar = (document.getElementById("swapToMatic") as HTMLInputElement).value;
      setWaiting(true);
      if (miktar == "0") {
        setErrMsgSnackbar("Please enter a value greater than 0");
        setErr(true);
        setWaiting(false);
        return
      } else if (miktar < "0") {
        setErrMsgSnackbar("Please enter a value greater than 0");
        setErr(true);
        setWaiting(false);
        return
      } else if (Number(miktar) > user?.deposit) {
        setErrMsgSnackbar("You do not have enough Coin");
        setErr(true);
        setWaiting(false);
        return
      }

      let response = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "swapToMatic",
          API_KEY: process.env.API_KEY,
          userToken: getCookie("user"),
          amount: miktar,
        }),
      });
      let data = await response.json();
      if (data.status === false) {
        setErrMsgSnackbar(data.message);
        setErr(true);
        setWaiting(false);
        return
      } else {
        getUser();
        setWaiting(false);
        setSucc(true);
        setSuccessMsgSnackbar(data.message);
      }
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




  return (
    <>
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
      {waiting ? (
        <div
          className="flex absolute min-w-full min-h-full bg-black/70 justify-center items-center "
        >please wait...
        </div>
      ) : null}
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3 p-10 text-gray-100">
        <h1 className="text-center">Deposit And Withdraw Page</h1>
        <p className="text-center">
          Swap your Matic to {Coin.name} and start earning
        </p>
        <p className=" text-lg text-center">
          Dear <span className="text-amber-500">{user.username}</span> you have{" "}
          <span className="text-green-500">{user.deposit}</span>{" "}
          <span className="text-blue-500">{Coin.name} </span>and
          <span className="text-pink-500"> {((user.maticBalance).toString()).slice(0, 6)} Matic </span>
          in your account
        </p>
        <div className="p-2 grid grid-cols-1 lg:grid-cols-2 w-full lg:w-2/3 gap-5">
          {/* //? Matic Deposit  */}
          <div className="w-full border rounded-lg flex flex-col items-center justify-center p-2 gap-5 py-10">
            <h4 className=" ">
              Deposit <span className="text-xs ">(MATIC)</span>{" "}
            </h4>
            <input
              type="number"
              placeholder="Type here"
              id="deposit"
              value={depositCount}
              onChange={(e) => {
                setDepositCount(e.target.value);
              }}
              className="input input-bordered w-full max-w-xs text-gray-800"
            />
            <button
              onClick={() => {
                paraYatir();
              }}
              className="btn btn-success max-w-xs w-full "
            >
              Deposit
            </button>
          </div>

          {/* //? Matic Withdraw */}
          <div className="w-full border rounded-lg flex flex-col items-center p-2 justify-center gap-5 py-10">
            <h4 className=" ">
              Withdraw <span className="text-sm text-green-500">{`(${settings?.requestType === 'Matic' ? "MATIC" : Coin.name})`}</span>{" "}
            </h4>
            <input
              type="number"
              placeholder="Type here"
              id="withdraw"
              className="input input-bordered w-full max-w-xs text-gray-800"
            />
            <button onClick={paraCek} className="btn btn-accent max-w-xs w-full">Withdraw</button>
          </div>

          {/* //? Swap Matic to Coin */}
          <div className="w-full border rounded-lg flex flex-col items-center p-2 justify-center gap-5 py-10">
            <h4 className=" ">
              Swap <span className="text-xs ">(MATIC to {Coin.name})</span>{" "}
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

          {/* //? Swap Coin to Matic */}
          <div className="w-full border rounded-lg flex flex-col items-center p-2 justify-center gap-5 py-10">
            <h4 className=" ">
              Swap <span className="text-xs ">({Coin.name} to MATIC)</span>{" "}
            </h4>
            <p className="text-xs "> 1 {Coin.katSayi} {Coin.name} = 1/{Coin.katSayi} MATIC </p>
            <input
              type="number"
              placeholder="Type here"
              id="swapToMatic"
              className="input input-bordered w-full max-w-xs text-gray-800"
            />
            <button onClick={swapToMatic} className="btn btn-secondary max-w-xs w-full">Swap to Matic</button>
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
