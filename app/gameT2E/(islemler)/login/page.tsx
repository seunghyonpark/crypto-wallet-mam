"use client";
import { setCookie } from "cookies-next";
import Link from "next/link";
import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import API from "@/libs/enums/API_KEY";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LoginPage() {
    const [succ, setSucc] = useState(false);
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState<String>("");
    const router = useRouter();

    const formSubmit = () => {
        let email = (document.getElementById("email") as HTMLInputElement).value;
        let pass = (document.getElementById("password") as HTMLInputElement).value;
        const formInputs = {
            API_KEY: process.env.API_KEY,
            method: "login",
            email: email,
            pass: pass,
        };
        fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formInputs),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.user) {
                    setErrMsg(data.message);
                    handleClickErr()
                } else {
                    handleClickSucc();
                    setCookie("user", data.user.user.userToken);
                    setCookie("username", data.user.user.username);
                    router.push("/gameT2E");
                }
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

    //todo username olmadan da giriş yapılabiliyor

    return (
        <>
            <div className="flex flex-col items-center justify-center py-10 h-full text-gray-500">
                <div className=" flex md:w-1/3 flex-col items-center justify-center gap-5 p-10 rounded-lg border bg-white shadow-md">
                    <h1 className="text-4xl  text-gray-500">Login</h1>
                    <div className="w-full relative h-[1px] border flex items-center justify-center">
                        <div className="absolute bg-green-500 left-0 w-2/3 h-[1px] z-40"></div>
                        <div className="absolute left-2/3  w-2 h-2 rounded-full bg-green-500 z-50"></div>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">ID (Email Address)</span>
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="input w-full  bg-gray-200 rounded-md text-gray-500"
                        />
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="input w-full  bg-gray-200 rounded-md text-gray-500"
                        />
                    </div>
                    <Button
                        color="secondary"
                        onClick={() => {
                            formSubmit();
                        }}
                        variant="contained"
                        className="bg-green-500 "
                    >
                        Login
                    </Button>
                </div>
                <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
                    <div className=""> If you have not an account  </div>
                    <Link
                        className="p-2 px-4 rounded-md bg-[#FFD369] text-gray-500  "
                        href={"/myPage/register"}
                    >
                        Sign Up Now
                    </Link>
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
                            You have successfully logged in!
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
