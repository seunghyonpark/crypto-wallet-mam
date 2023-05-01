'use client';
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import React from 'react'

export default function AdminGas() {
    const [requests, setRequests] = React.useState(0)

    const getAll = async () => {
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "getAll",
                API_KEY: process.env.API_KEY,
                userToken: getCookie("admin")
            }),
        })
        const data = await res.json()
        if (data.payments.length == 0) return setRequests(0)
        setRequests(data.payments.length)
    }

    if (requests == 0) getAll()

    return (
        <>
            <div className='flex flex-col items-center gap-3  border rounded-lg p-4 w-full h-full'>
                <div className="text-ml">Total BNB Amount</div>
                <p>Current: <span className='text-pink-500'>{0.6234}</span> BNB</p>
                {/*
                <Link href="/" className='btn btn-md btn-primary'>See All</Link>
    */}
            </div>
        </>
    )
}
