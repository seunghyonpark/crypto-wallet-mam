'use client';
import { IUser } from "@/libs/interface/user";
import { getCookie, hasCookie } from "cookies-next";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<IUser>()
    const router = useRouter();
    const pathName = usePathname();
    
    const getUser = async () => {
        const inputs = {
            method: 'getOne',
            API_KEY: process.env.API_KEY,
            userToken: getCookie('admin')
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
        if (hasCookie("admin") && !user) {
            //setInterval(() => {
                getUser()
            //}, 5000)
        } else if (!hasCookie("admin" || !user)) {
            router.push('/')
        }
    }, [router, user])


    if (!user) return (
        <>

        {/*
            <div className="flex flex-col items-center justify-center w-full h-full min-h-screen text-2xl">
                You shall not pass ! -Gandalf The Gray
            </div>
    */}

            <div className="flex flex-col items-center justify-center w-full h-full min-h-screen text-2xl">
                You shall not pass !!!
            </div>
        </>
    )

    return (
        <>
            <html lang="en" data-theme='dark'>
                <head />
                <body >
                    <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
                        <div className="w-full md:w-44 h-full md:min-h-screen flex flex-col gap-10 py-5 p-2 border-b md:border-b-0 md:border-r">
                            <div className="flex flex-col items-center gap-3">
                                <Image src="/logo.png" width={100} height={100} alt="logo" />
                                <div className="text-xl font-bold">Admin Panel</div>

                                <div className="text-xl font-bold">{user?.username}</div>

                            </div>
                            <div className="flex md:flex-col gap-2 overflow-x-auto">
                                <Link className={`${pathName === '/admin/dashboard' ? 'text-gray-200' : 'text-gray-500'} `} href="/admin/dashboard">
                                    Dashboard
                                </Link>
                                <Link className={`${pathName === '/admin/dashboard/users' ? 'text-gray-200' : 'text-gray-500'} `} href="/admin/dashboard/users">
                                    Users
                                </Link>
                                <Link className={`${pathName === '/admin/dashboard/deposits' ? 'text-gray-200' : 'text-gray-500'} `} href="/admin/dashboard/deposits">
                                    Deposits
                                </Link>
                                <Link className={`${pathName === '/admin/dashboard/withdrawRequests' ? 'text-gray-200' : 'text-gray-500'} `} href="/admin/dashboard/withdrawRequests">
                                    Withdraw Requests
                                </Link>
                                <Link className={`${pathName === '/admin/dashboard/banking' ? 'text-gray-200' : 'text-gray-500'} `} href="/admin/dashboard/banking">
                                    Banking
                                </Link>
                                <Link className={`${pathName === '/admin/dashboard/predictions' ? 'text-gray-200' : 'text-gray-500'} `} href="/admin/dashboard/predictions">
                                    Bet History
                                </Link>

                                {/*
                                <Link className={`${pathName === '/admin/dashboard/settings' ? 'text-gray-200' : 'text-gray-500'} `} href="/admin/dashboard/settings">
                                    General Settings
                                </Link>
                                */}
                                <Link className={`${pathName === '/admin/dashboard/mypage' ? 'text-gray-200' : 'text-gray-500'} `} href="/admin/dashboard/mypage">
                                    My Page
                                </Link>
                            </div>
                        </div>
                        <div className={`w-full`}>{children}</div>
                    </div>
                </body>
            </html>

        </>

    )
}
