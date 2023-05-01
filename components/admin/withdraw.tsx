'use client';
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import React from 'react'

export default function AdminWithdraw() {

    const [withdrawSum, setWithdrawSum] = React.useState(0)

    const getAllSum = async () => {
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "getAllAmount",
                API_KEY: process.env.API_KEY,
                userToken: getCookie("admin")
            }),
        })
        const data = await res.json()

        console.log(data)

        setWithdrawSum(data.sum)
        
        //if (data.payments.length == 0) return setRequests(0)
        //setRequests(data.payments.length)
    }

    React.useEffect(() => {
        getAllSum()
    }, [])

    return (
        <>
            <div className='flex flex-col items-center gap-3  border rounded-lg p-4 w-full h-full'>
                <div className="text-ml">Total Withdraw Amount</div>
                <p>Current: <span className='text-pink-500'>{Number(withdrawSum).toFixed(2)}</span> CRA</p>
                {/*
                <Link href="/" className='btn btn-md btn-primary'>See All</Link>
                */}
            </div>
        </>
    )
}
