//@ts-nocheck
'use client';
import React, { useRef } from "react";

export default function YuruyenAt({ time, horseSrc }: any) {
    const ref = useRef(null);
    React.useEffect(() => {
        import("@lottiefiles/lottie-player");
    });
    return (
        <>
            <div className="flex flex-col w-full items-center justify-center">
                <div className='flex w-full items-center justify-center'>
                    <lottie-player
                        id="firstLottie"
                        ref={ref}
                        autoplay
                        loop
                        mode="normal"
                        src={horseSrc}
                        style={{ width: "300px", height: "300px" }}
                    ></lottie-player>
                </div>
                {time && <p className="text-2xl text-white">Last {time} seconds for bets</p>}
            </div>
        </>
    )
}
