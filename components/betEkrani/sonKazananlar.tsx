'use client';
import Horses from '@/libs/enums/horses.enums'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { IHistory } from '@/libs/interface/historyInterface';


export default function SonKazananlar() {
    const [sonKazananlar, setSonKazananlar] = useState<any>()

    const getSonKazananlar = async () => {
        const response = await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({
                API_KEY: process.env.API_KEY,
                method: "getLast"
            })
        })
        const data = await response.json()
        setSonKazananlar(data.lastGame)
    }

    useEffect(() => {
        getSonKazananlar()
    }, [])


    return (
        <div className='absolute text-white right-5 top-20  bg-black/20 rounded-lg backdrop-blur-md p-5 hidden lg:flex flex-col gap-3 items-center justify-center'>
            <h4 className=' border-b mb-2'>Last Race Winners</h4>
            {
                sonKazananlar && sonKazananlar.placements.map((item: any,) => {
                    return (
                        <div key={item.line} className='flex items-center gap-2'>
                            <p className='  text-center text-green-500'> {item.horse} </p>
                            <Image src={`/at${item.line}.png`} width={100} height={100} alt='alt1' />
                        </div>
                    )
                })
            }
        </div>
    )
}


