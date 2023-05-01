'use client';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function AdminLogin() {
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
                    //todo error
                    router.push("/");
                } else {
                    //todo success
                    if (data.user.user.admin) {
                        router.push("/admin/dashboard");
                        setCookie("admin", data.user.user.userToken);
                    } else {
                        router.push("/");
                    }
                }
            });
    };

    return (
        <>
            <div className='flex flex-col items-center justify-center w-full h-full min-h-screen bg-[url(/admin.jpg)] bg-center bg-contain '>
                <div className='flex flex-col items-center justify-center gap-3 border rounded-lg p-10 w-full md:1/2 lg:w-1/4 bg-black/10 backdrop-blur-sm  '>
                    <h1 className='text-2xl text-gray-200'>Admin Login</h1>
                    <input id='email' type="text" className='input w-full dark:text-white' placeholder='E-Mail' />
                    <input id='password' type="password" className='input w-full dark:text-white' placeholder='Password' />
                    <button onClick={formSubmit} className='btn btn-primary w-full'>Login</button>
                </div>
            </div>
        </>
    )
}
