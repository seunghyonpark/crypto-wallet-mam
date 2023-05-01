"use client";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { AiOutlineUser } from "react-icons/ai";
import { VscGear, VscCheck } from "react-icons/vsc";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import Link from "next/link";
import API from "@/libs/enums/API_KEY";
import { useRouter, useSearchParams } from 'next/navigation';
import DomainEnum from "@/libs/enums/domain";


import { useFormik } from "formik";
import * as Yup from "yup";



// Yup schema to validate the form
const schema = Yup.object().shape({
    email: Yup.string()
        .required('Email is required')
        .email(),
    pass1: Yup.string()
        .required()
        .min(7),
    pass2: Yup.string()
        .required()
        .min(7),
    username: Yup.string()
        .required("Nick name is required")
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for nick name")
        .min(5, "Nick name must be at least 5 characters")
        .max(10),
    referral: Yup.string()
        .notRequired(),
        //.matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for nick name")
        //.min(5, "Referral must be at least 5 characters")
        //.max(10),

    terms: Yup.boolean()
        .required("Accept Terms & Conditions is required")
        .oneOf([true], "Accept Terms & Conditions is required"),

});

/*
    username: Yup.string().required().min(5).max(10).matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for nick name"),
// Match only letters
'Lüdenscheid'.match(/[\p{Letter}\p{Mark}]+/gu)
*/


export default function RegisterPage() {
    
    const MySwal = withReactContent(Swal);

    const [succ, setSucc] = React.useState(false);
    const [err, setErr] = React.useState(false);
    const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
    const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");

    const [metamusk, setMetaMask] = useState<boolean>(false);
    const [wallet, setWallet] = useState<any>(null);
    const [networkName, setNetworkName] = useState<any>(null);
    const [network, setNetwork] = useState<any>(false);
    const router = useRouter();

    const [authCodeState, setAuthCodeState] = React.useState(false);
    const [authCode, setAuthCode] = useState<any>(null);

    const [emailVerified, setEmailVerified] = React.useState(false);

    


    const searchParams = useSearchParams();

    const referralCode = searchParams.get('referral');

 

    const sendAuthCodeByEmail = async () => {

        let userToken = crypto.randomUUID();
    
        const formInput = {
            method: 'sendAuthCodeByEmail',
            API_KEY: process.env.API_KEY,
            email: values.email,
            userToken: userToken,
        };
        fetch("/api/user", {
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



    const verifyUserByEmail = async () => {
    
        const formInput = {
            method: 'verifyUserByEmail',
            API_KEY: process.env.API_KEY,
            email: values.email,
            authCode: authCode,
        };
        fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formInput),
        })
        .then((res) => res.json())
        .then((data) => {

            /////console.log("verifyUserByEmail", data);

            if (data?.status) {

                ///alert("success");
    
                ////setSuccessMsgSnackbar(data.message);
                ////handleClickSucc();

                setEmailVerified(true);
    
            } else {

                setErrMsgSnackbar("Invalid Auth Code");
                handleClickErr();
    
            }
    
        });
    
    }

    


    // Formik hook to handle the form state
    const formik = useFormik({
        initialValues: {
            email: "",
            pass1: "",
            pass2: "",
            username: "",
            referral: "",
            terms: false,
        },

        // Pass the Yup schema to validate the form
        validationSchema: schema,

        // Handle form submission
        onSubmit: async ({ email, pass1, pass2, username, referral }) => {
        // Make a request to your backend to store the data

        const formInput = {
            method: 'signupByEmail',
            API_KEY: process.env.API_KEY,
            email: email,
            username: username,
            pass1: pass1,
            pass2: pass2,
            nftWalletAddress: wallet,
            referral: referral,
        };
        fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formInput),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setSuccessMsgSnackbar(data.message);
                    handleClickSucc();
                    router.push("/myPage/login");
                }
                else {
                    setErrMsgSnackbar(data.message);
                    handleClickErr();
                }
                //todo
                // handleClickSucc();
            });


        },

        /*
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
            nftWalletAddress: wallet,
            referral: referral,
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


        },
        */


    });

    // Destructure the formik object
    const { errors, touched, values, handleChange, handleSubmit } = formik;


    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    useEffect(() => {


        setWallet("0x");
        


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


    /*
    useEffect(() => {
        if (isMetaMaskInstalled()) {
            wrongWallet();
            connectWallet();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    */


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
            nftWalletAddress: wallet,
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
                    setErrMsgSnackbar(data.message);
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
            <div className="flex flex-col items-center justify-center py-5 h-full text-black gap-4">


                <div className="flex flex-col md:flex-row justify-center w-full h-full gap-10 pl-5 pr-5 ">



 <div className="flex flex-col  justify-center h-full md:w-1/3 bg-white rounded-lg shadow-md p-4">

    <div className="pb-0 space-y-3">
        <div className="flex gap-2 items-center pl-4">
            {/*
            <VscGear className="fill-red-500 w-5 h-5" />
            <h2 className="text-gray-500 text-lg">
                Personal Information
            </h2>
    */}
            <h2 className="text-4xl  text-gray-500">Sign Up</h2>
        </div>
        <div className="w-full relative h-[1px] border flex items-center justify-center">
            <div className="absolute bg-red-500 left-0 w-1/3 h-[1px] z-40"></div>
            <div className="absolute left-1/3  w-2 h-2 rounded-full bg-red-500 z-50"></div>
        </div>
    </div>

                
    <form
        className="mt-5"
        onSubmit={handleSubmit} method="POST">

        <label
            className="label"
            htmlFor="Email Address">
                <span className="label-text">Email Address</span>
        </label>

        {!emailVerified &&
            <div className=" w-full flex flex-row gap-5 mt-2">
                You have to verify your email address.
            </div>
        }
       
        <div className=" w-full flex flex-row gap-5 mt-2">

            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={values.email}
                onChange={handleChange}
                id="email"
                className=" input w-full bg-gray-200 rounded-md mb-2"
                disabled={authCodeState}
                
            />

            {emailVerified && <VscCheck className=" w-10 h-10 text-green-500" />}

        </div>

        {errors.email && touched.email && <span>{errors.email}</span>}

        {authCodeState && !emailVerified &&

            <>
                <div className=" w-full flex flex-row gap-5 mt-2">
                    <input
                        type="number"
                        placeholder="Auth Code"
                        id="authCode"
                        onChange={(e) => {
                            setAuthCode(e.target.value);
                        }}
                        className="input input-bordered w-full max-w-xs text-gray-800 mb-5"
                    />

                    <Button variant="contained" color="primary" className=" w-full h-12 " onClick={() => {
                        verifyUserByEmail();
                    }}> Verify </Button>
                </div>

            </>
        }
    
        {!authCodeState &&

            <div className=" w-full flex flex-row gap-5 mt-2">

            <Button
                variant="contained" color="primary" 
                className=" mt-2"
                onClick={() => {
                    sendAuthCodeByEmail();
                }}
            >
                Send Auth Code
            </Button>

            </div>
        }



        {emailVerified ?
        
            <>


        <label
            htmlFor="Password"
            className="label">
                <span className="label-text">Password</span>
            </label>
        <input
            type="password"
            name="pass1"
            value={values.pass1}
            onChange={handleChange}
            id="pass1"
            className="input w-full bg-gray-200 rounded-md"
        />
        {errors.pass1 && touched.pass1 && <span>{errors.pass1}</span>}

        <label
            htmlFor="Password"
            className="label">
                <span className="label-text">Re-enter your Password</span>
            </label>
        <input
            type="password"
            name="pass2"
            value={values.pass2}
            onChange={handleChange}
            id="pass2"
            className="input w-full bg-gray-200 rounded-md"
        />
        {errors.pass2 && touched.pass2 && <span>{errors.pass2}</span>}

        <label
            htmlFor="Nick Name"
            className="label">
                <span className="label-text">Nick Name</span>
            </label>
        <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            id="username"
            className="input w-full bg-gray-200 rounded-md"
        />
        {errors.username && touched.username && <span>{errors.username}</span>}


        <label
            htmlFor="Referral Code"
            className="label">
                <span className="label-text">Referral Code</span>
        </label>
        <input
            type="text"
            name="referral"
            value={ (referralCode) ? referralCode : values.referral }
            
            ///value={ values.referral }

            onChange={handleChange}
            id="referral"
            className="input w-full bg-gray-200 rounded-md"
        />
        {errors.referral && touched.referral && <span>{errors.referral}</span>}


        <div className="flex flex-row">
        </div>


        <div className="flex flex-row">
            <input
                type="checkbox"
                name="terms"
                ////value={values.terms}
                onChange={handleChange}
                id="terms"
                className="checkbox checkbox-sm checkbox-primary mt-2"
            />
            <label
                htmlFor="Terms and Conditions"
                className="label ml-3">
                    <span className="label-text">
                    I have read and agree to the User Agreement and Privacy Policy.
                    &nbsp;<Link  href="/gameT2E/terms"><span className="text-bold text-blue-500">(See Details)</span></Link>
                    </span>
            </label>
        </div>
        {errors.terms && touched.terms && <span>{errors.terms}</span>}



      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white text-center justify-center m-5 p-5 rounded-md ">
            SIGN UP
      </button>


            </>
            :
            <></>
        }

    </form>
    
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

            </div>
        </>
    );
}
