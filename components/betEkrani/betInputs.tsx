'use client';
import API from '@/libs/enums/API_KEY';
import Horses from '@/libs/enums/horses.enums';
import { IUser } from '@/libs/interface/user';
import { getCookie, hasCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import { FaCoins } from 'react-icons/fa'

//export default function BetInputs({ horse1, horse2, horse3, horse4, horse5 }: any) {

export default function BetInputs({ horse1, horse2 }: any) {
    const [user, setUser] = useState<IUser>()
    const [secilenAt, setSecilenAt] = useState<any>(null)
    
    const [betAmount, setBetAmount] = useState<any>(0)

    const getUser = async () => {
        const inputs = {
            method: 'getOne',
            API_KEY: process.env.API_KEY,
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
        if (hasCookie('user')) {
            getUser()
        }
    }, [])


    const placeBet = async () => {
        if (user) {
            if (betAmount > user?.deposit) return alert('You dont have enough money to bet this amount')
            if (betAmount === 0) return alert('You need to enter a bet amount')
            if (betAmount < 0) return alert('You cannot bet a negative amount')
            if (secilenAt === null) return alert('You need to select a horse to bet')
            const formInputs = {
                method: 'newGame',
                API_KEY: process.env.API_KEY,
                userToken: getCookie('user'),
                img: user?.img,
                username: user?.username,
                betAmount: betAmount,
                selectedSide: secilenAt
            }


            const res = await fetch('/api/game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formInputs)
            })
            const data = await res.json()
            if (data.message === 'Success') {
                alert('You have successfully placed your bet')
            } else {
                alert('You have already placed a bet')
            }
        } else {
            alert('You need to login to place a bet')
        }
    }

    return (
        <>
            <div className='flex flex-col items-center justify-center gap-5 w-full lg:w-2/3 '>
                {/* //? Input amount manuel */}
                <div className='flex items-center w-full md:w-1/2 relative'>
                    <div className='absolute left-5 z-10'> <FaCoins className='fill-yellow-500' /> </div>
                    <input onChange={(e: any) => {
                        setBetAmount(e.target.value)
                    }}
                        value={betAmount === 0 ? '' : betAmount}
                        type="number"
                        placeholder='Enter your bet (CRA)'
                        className='input w-full pl-20' />
                    <button onClick={() => { setBetAmount(0) }} className='absolute right-5 z-10 btn btn-xs btn-outline border-gray-700'>Clear</button>
                </div>
                {/* //? Miktar Selector Buttons */}
                <div className='grid grid-cols-4 content-center md:flex w-full gap-3 items-center justify-center text-white'>
                    <button
                        onClick={() => {
                            setBetAmount(betAmount + 1)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border'> +1 </button>
                    <button
                        onClick={() => {
                            setBetAmount(betAmount + 5)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border'> +5 </button>
                    <button
                        onClick={() => {
                            setBetAmount(betAmount + 10)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border'> +10 </button>
                    <button
                        onClick={() => {
                            setBetAmount(betAmount + 50)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border'> +50 </button>
                    <button
                        onClick={() => {
                            setBetAmount(betAmount + 100)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border'> +100 </button>
                    <button
                        onClick={() => {
                            setBetAmount(betAmount + 200)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border'> +200 </button>
                    <button
                        onClick={() => {
                            setBetAmount(betAmount * 2)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border'> x2 </button>
                    <button
                        onClick={() => {
                            setBetAmount(betAmount / 2)
                        }}
                        className='btn btn-circle bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border'> /2 </button>
                    {user && <button
                        onClick={() => {
                            setBetAmount(user?.deposit - 0.00001)
                        }}
                        className='btn btn-circle hidden md:block bg-[url(/cion.webp)] bg-contain bg-center bg-no-repeat text-black border'> Max </button>}
                </div>
                {/* //? Horse Select Buttons */}
                <div className='flex flex-col md:flex-row items-center justify-center w-full md:justify-around gap-3'>
                    <button onClick={() => { setSecilenAt(Horses.Horse1) }}
                        className={`btn hidden md:block border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse1 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                    >{Horses.Horse1} x{horse1} </button>
                    <button onClick={() => { setSecilenAt(Horses.Horse2) }}
                        className={`btn hidden md:block border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse2 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                    >{Horses.Horse2} x{horse2}</button>

                    <div className="space-x-10 md:hidden">
                        <button onClick={() => { setSecilenAt(Horses.Horse1) }}
                            className={`btn border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse1 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                        >{Horses.Horse1} x{horse1} </button>
                        <button onClick={() => { setSecilenAt(Horses.Horse2) }}
                            className={`btn border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse2 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                        >{Horses.Horse2} x{horse2}</button>
                    </div>


                        {/*
                    <button onClick={() => { setSecilenAt(Horses.Horse3) }}
                        className={`btn hidden md:block border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse3 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                    >{Horses.Horse3} x{horse3}</button>
                    <button onClick={() => { setSecilenAt(Horses.Horse4) }}
                        className={`btn hidden md:block border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse4 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                    >{Horses.Horse4} x{horse4}</button>
                    <div className="space-x-10 md:hidden">
                        <button onClick={() => { setSecilenAt(Horses.Horse3) }}
                            className={`btn border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse3 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                        >{Horses.Horse3} x{horse3}</button>
                        <button onClick={() => { setSecilenAt(Horses.Horse4) }}
                            className={`btn border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse4 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                        >{Horses.Horse4} x{horse4}</button>
                    </div>
                    <button onClick={() => { setSecilenAt(Horses.Horse5) }}
                        className={`btn border text-center border-white text-white p-1 btn-circle bg=[#333541] btn-xl w-20 h-20 ${secilenAt === Horses.Horse5 ? "bg=[#333541]" : secilenAt === 0 ? "bg=[#333541]" : "btn-ghost"}`}
                    >{Horses.Horse5} x{horse5}</button>
                    */}


                </div>
                <button onClick={placeBet} className='btn btn-success mt-5 w-full'>Place Bet </button>
            </div>
        </>
    )
}
