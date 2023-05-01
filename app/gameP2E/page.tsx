'use client';
import BetInputs from '@/components/betHorse/betInputs';
import BetTables from '@/components/betHorse/betTables';

import Son20Oyun from '@/components/betHorse/son20';
import SonKazananlar from '@/components/betHorse/sonKazananlar';
import YuruyenAt from '@/components/betHorse/yuruyenAt';
import Race from '@/components/yarisEkrani/horse';
import SocketEnum from '@/libs/enums/socket';
import React, { useEffect, useState } from 'react';


//@ts-ignore
import { io } from "socket.io-client";

// Bebas Neue
let socket;

export default function GameP2E() {
    const [status, setStatus] = useState<any>();
    const [time, setTime] = useState<any>(0);
    const [horse1Oran, setHorse1Oran] = useState<any>([]);
    const [horse2Oran, setHorse2Oran] = useState<any>([]);
    const [horse3Oran, setHorse3Oran] = useState<any>([]);
    const [horse4Oran, setHorse4Oran] = useState<any>([]);
    const [horse5Oran, setHorse5Oran] = useState<any>([]);

    useEffect(() => socketInitializer(), []);




    const socketInitializer = () => {

        console.log("socketInitializer gameServer",SocketEnum.gameServer);

        const socket = io(`${SocketEnum.gameServer}`, {
            transports: ["websocket"],
        });
        socket.on("connect", () => {
        })
        socket.on('status', (data: any) => { setStatus(data) })
        socket.on('time', (data: any) => { setTime(data) })
        socket.on('horse1Orana', (data: any) => { setHorse1Oran(data) })
        socket.on('horse2Orana', (data: any) => { setHorse2Oran(data) })
        socket.on('horse3Orana', (data: any) => { setHorse3Oran(data) })
        socket.on('horse4Orana', (data: any) => { setHorse4Oran(data) })
        socket.on('horse5Orana', (data: any) => { setHorse5Oran(data) })
    }
    
    return (
        <>
            {!status ?
                (
                    <div className='flex flex-col px-10 pb-10 w-full h-full items-center justify-center gap-5 bg-[#0C0E1A] relative'>
                        <SonKazananlar />
                        <Son20Oyun />
                        <div className="bg-center bg-no-repeat bg-contain bg-[url(/back.svg)] h-full ">
                            <div className="flex flex-col items-center justify-center md:gap-14 md:py-10 bg-gradient-radial from-transparent via-[#0C0E1A] to-transparent bg-blend-difference h-full md:px-32">
                                <YuruyenAt time={time} horseSrc={'/at.json'} />
                            </div>
                        </div>
                        <BetInputs 
                        horse1={horse1Oran}
                        horse2={horse2Oran}
                        horse3={horse3Oran}
                        horse4={horse4Oran}
                        horse5={horse5Oran}
                        />
                        <BetTables />
                    </div>
                )
                :
                < Race />
            }
        </>
    )
}
