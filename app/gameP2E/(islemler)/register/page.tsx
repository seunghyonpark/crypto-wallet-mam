"use client";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { AiOutlineUser } from "react-icons/ai";
import { VscGear } from "react-icons/vsc";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import Link from "next/link";
import API from "@/libs/enums/API_KEY";
import { useRouter } from 'next/navigation';
import DomainEnum from "@/libs/enums/domain";


export default function RegisterPage() {
    const MySwal = withReactContent(Swal);
    const [succ, setSucc] = React.useState(false);
    const [err, setErr] = React.useState(false);
    const [errMsg, setErrMsg] = useState<String>();
    const [metamusk, setMetaMask] = useState<boolean>(false);
    const [wallet, setWallet] = useState<any>(null);
    const [networkName, setNetworkName] = useState<any>(null);
    const [network, setNetwork] = useState<any>(false);
    const router = useRouter();


    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

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
                            await ethereum.request({
                                method: "wallet_switchEthereumChain",
                                params: [{ chainId: "0x61" }],
                            })
                                .then(() => {
                                    if (ethereum) {
                                        ethereum.on("chainChanged", async (chainId: any) => {
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
                        catch (error: any) {
                            if (error.code === 4902) {
                                await ethereum.request({
                                    method: "wallet_addEthereumChain",
                                    params: [
                                        {
                                            chainId: '0x61',
                                            chainName: 'Smart Chain - Testnet',
                                            nativeCurrency: {
                                                name: 'Binance TestNet',
                                                symbol: 'tBNB', // 2-6 characters long
                                                decimals: 18
                                            },
                                            blockExplorerUrls: ['https://testnet.bscscan.com'],
                                            rpcUrls: ['https://data-seed-prebsc-2-s3.binance.org:8545'],
                                        },
                                    ],
                                })
                                    .then(() => {
                                        if (ethereum) {
                                            ethereum.on("chainChanged", async (chainId: any) => {
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
            if (chainId !== "0x61") {
                setNetwork(false);
            } else {
                setNetwork(true);
            }
        } catch (e: any) {
        }
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

    const formSubmit = () => {
        let username = (document.getElementById("username") as HTMLInputElement)
            .value;
        let email = (document.getElementById("email") as HTMLInputElement).value;
        let pass1 = (document.getElementById("pass1") as HTMLInputElement).value;
        let pass2 = (document.getElementById("pass2") as HTMLInputElement).value;
        let userToken = crypto.randomUUID();

        const formInput = {
            method: 'create',
            API_KEY: process.env.API_KEY,
            username: username,
            email: email,
            pass1: pass1,
            pass2: pass2,
            userToken: userToken,
            walletAddress: wallet,
        };
        fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formInput),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    handleClickSucc();
                    router.push("/myPage/login");
                }
                else {
                    setErrMsg(data.message);
                    handleClickErr();
                }
                //todo
                // handleClickSucc();
            });
    };

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
            <div className="flex flex-col items-center justify-center py-10 h-full text-black gap-4">
                <div className="flex flex-col md:flex-row justify-center w-full h-full gap-10 p-10">
                    <div className="flex flex-col  justify-center h-full md:w-1/3 bg-white rounded-lg shadow-md p-4">
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
                                    <Button className="w-full text-white text-center justify-center h-500 p-5 items-center bg-[#24252f] hover:bg-[#141111] rounded-md flex flex-col">
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
                    <div className="flex flex-col  justify-center h-full md:w-1/2 bg-white rounded-lg shadow-md p-4">
                        <div className="pb-10 space-y-3">
                            <div className="flex gap-2 items-center pl-4">
                                <VscGear className="fill-red-500 w-5 h-5" />
                                <h2 className="text-gray-500 text-lg">
                                    Personal Information
                                </h2>
                            </div>
                            <div className="w-full relative h-[1px] border flex items-center justify-center">
                                <div className="absolute bg-red-500 left-0 w-1/3 h-[1px] z-40"></div>
                                <div className="absolute left-1/3  w-2 h-2 rounded-full bg-red-500 z-50"></div>
                            </div>
                        </div>
                        <label className="label">
                            <span className="label-text">Username:</span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="input w-full bg-gray-200 rounded-md"
                        />
                        <label className="label">
                            <span className="label-text">E-Mail:</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="input w-full  bg-gray-200 rounded-md"
                        />
                        <label className="label">
                            <span className="label-text">Password:</span>
                        </label>
                        <input
                            type="password"
                            id="pass1"
                            className="input w-full  bg-gray-200 rounded-md"
                        />
                        <label className="label">
                            <span className="label-text">Password:</span>
                        </label>
                        <input
                            type="password"
                            id="pass2"
                            className="input w-full bg-gray-200 rounded-md"
                        />
                    </div>
                </div>

                <Button
                    onClick={() => {
                        formSubmit();
                    }}
                    variant="contained"
                    color="secondary"
                    className="bg-green-500 hover:bg-green-600 text-white text-center justify-center h-500 p-5 rounded-md "
                >
                    Sign Up
                </Button>

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
                            Account successfully created!
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
            </div>
        </>
    );
}
