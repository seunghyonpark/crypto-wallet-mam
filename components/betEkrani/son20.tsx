import Horses from '@/libs/enums/horses.enums'
import React, { useEffect } from 'react'


export default function Son20Oyun() {
    const [son20Oyun, setSon20Oyun] = React.useState<any>()

    const getLast20 = async () => {
        const response = await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({
                API_KEY: process.env.API_KEY,
                method: "getAll"
            })
        })
        const data = await response.json()
        setSon20Oyun(data.all)
    }

    useEffect(() => {
        getLast20()
    }, [])


    return (
        <div className='absolute text-white left-5 top-10  bg-black/20 rounded-lg backdrop-blur-md p-3 hidden  lg:flex flex-col gap-3 items-center justify-center'>
            <h6 className=' border-b mb-1'>Last Race Winners</h6>
            <div className='flex flex-col gap-2 text-xs text-green-400'>
                {
                    son20Oyun && son20Oyun.map((item: any) => {
                        return (
                            <div key={item._id}>
                                {item.winnerHorse}
                            </div>
                        )
                    })}

            </div>
        </div>
    )
}
