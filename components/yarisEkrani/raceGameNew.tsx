"use client";
import Horses from "@/libs/enums/horses.enums";
import SocketEnum from "@/libs/enums/socket";
import Image from "next/image";
import { useEffect, useState } from "react";
//@ts-ignore
import { io } from "socket.io-client";
import { BsFillVolumeUpFill, BsFillVolumeMuteFill } from "react-icons/bs";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useRouter } from 'next/navigation';

import Winner from './winner';


let socket;
export default function RaceNew({betPrice, betLongShort, betAmount}: {betPrice: any, betLongShort: any, betAmount: any}) {



    ////Swal.fire('승인이 완료되었습니다.', '화끈하시네요~! LongShort' + betLongShort, 'success');

    ///console.log("raceGame betLongShort===>", betLongShort);



    const MySwal = withReactContent(Swal);


    const [status, setStatus] = useState<any>();

    const [progress1, setProgress1] = useState<any>(0);
    const [progress2, setProgress2] = useState<any>(0);
    //const [progress3, setProgress3] = useState<any>(0);
    //const [progress4, setProgress4] = useState<any>(0);
    //const [progress5, setProgress5] = useState<any>(0);

    const [fence, setFence] = useState(0);
    const [horses, setHorses] = useState<any>([]);
    const [winner, setWinner] = useState<any>();
    const [soundStatus, setSoundStatus] = useState(true);
    const [finishLine, setFinishLine] = useState(false);

    const [currentPrice, setCurrentPrice] = useState<any>(1682.32);

    const [betAmountLong, setBetAmountLong] = useState<any>("");
    const [betAmountShort, setBetAmountShort] = useState<any>("");

    const [timeRemaining, setTimeRemaining] = useState<any>(0.00);


    const [imageRabbit1, setImageRabbit1] = useState<any>("");
    const [imageRabbit2, setImageRabbit2] = useState<any>("");

   



    /*
    if (betLongShort === "Long") {
        setBetAmountLong(betAmount);
        setBetAmountShort("");
    } else if (betLongShort === "Short") {
        setBetAmountShort(betAmount);
        setBetAmountLong("");
    }
    */

    useEffect(() => {

        //console.log("betLongShort", betLongShort);
        //console.log("betAmount", betAmount);

        if (betLongShort === "Long") {
            setBetAmountLong("My Rabbit: " + betAmount);
            setBetAmountShort("");
        } else if (betLongShort === "Short") {
            setBetAmountShort("My Rabbit: " + betAmount);
            setBetAmountLong("");
        }
        
    }, [betLongShort, setBetAmountLong, setBetAmountShort, betAmount]);


    setTimeout(() => {
        setHorses([
            { id: 1, progress: progress1, name: `${Horses.Horse1}`, image: imageRabbit1 },
            { id: 2, progress: progress2, name: `${Horses.Horse2}`, image: imageRabbit2 },
            //{ id: 3, progress: progress3, name: `${Horses.Horse3}` },
            //{ id: 4, progress: progress4, name: `${Horses.Horse4}` },
            //{ id: 5, progress: progress5, name: `${Horses.Horse5}` },
        ]);

        const price = 1682.32 + progress1-progress2;
        setCurrentPrice(price);

    }, 40);
    //}, 1000);


    useEffect(() => socketInitializer(), []);
    


    const { push } = useRouter();

    const socketInitializer = () => {
        const socket = io(`${SocketEnum.id}`, {
            transports: ["websocket"],
        });

        socket.on("connect", () => {

            console.log("raceGame socketInitializer connect");
        });

        socket.on('status', (data: any) => {

            console.log("raceGame status", data);

            setStatus(data)

            
        })

        socket.on("winner", (data: any) => {
            console.log("raceGame winner", data);

            setWinner(data);



            let textResult = "";
            let imageUrl = "";

            if (data === betLongShort) { // You win
                textResult = "You win";
                imageUrl = "/winner.gif";
            } else { // You lose
                textResult = "You lose";
                imageUrl = "/loser.gif";
            }


            /*
            MySwal.fire({
                //title: "You Bet: " + betLongShort + "<br>Game Result: " + data,
                html: "You Bet: " + betLongShort + "<br>Game Result: " + data,
                text: textResult,
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "OK",
                cancelButtonText: "Game History",

                imageUrl: imageUrl,
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Custom image'

           
                //animation: true,
              }).then(async (result: any) => {


              });

              */









        })

        socket.on("horse1", (data: any) => {
            //console.log("Race socketInitializer horse1", data);
            setProgress1(data);



        });

        socket.on("horse2", (data: any) => {
            //console.log("Race socketInitializer horse2", data);
            setProgress2(data);

        });

        /*
        socket.on("horse3", (data: any) => {
            //console.log("Race socketInitializer horse3", data);
            //////setProgress3(data);
        });

        socket.on("horse4", (data: any) => {
            //console.log("Race socketInitializer horse4", data);
            ///setProgress4(data);
        });

        socket.on("horse5", (data: any) => {
            //console.log("Race socketInitializer horse5", data);
            ///setProgress5(data);
        });
        */


        socket.on("timer", (data: any) => {
            ////console.log("Race socketInitializer timer", data);
           
            ///setProgress5(data);

            /* 90 seconds
            if ( (90000 - (data*1000) ) > 0) {
                setTimeRemaining( (90000 - (data * 1000)) / 1000);
            } else {
                setTimeRemaining(0);
            }
            */

            // 60 seconds
            if ( (60000 - (data*1000) ) > 0) {
                setTimeRemaining( (60000 - (data * 1000)) / 1000);
            } else {
                setTimeRemaining(0);
            }


        });
        

    };


    /*
    useEffect(() => {

        if (status) {
            setTimeout(() => {
                
                setFinishLine(true);

            ////////////////}, 28 * 1000)
            }, 88 * 1000)
        }

    }, [status])
    */


    useEffect(() => {


        if ( (progress1-progress2) > 0) {
            setImageRabbit1("/rabbit1_winning.gif");
            setImageRabbit2("/rabbit2_losing.gif");
        } else if ( (progress2-progress1) > 0) {
            setImageRabbit1("/rabbit1_losing.gif");
            setImageRabbit2("/rabbit2_winning.gif");
        } else {
            setImageRabbit1("/rabbit1.gif");
            setImageRabbit2("/rabbit2.gif");
        }


    }, [progress1, progress2])



    setTimeout(() => {
        setFence(fence - 1);
    }, 60);



    /*
    setTimeout(() => {

        if (timeRemaining > 0) {

            setTimeRemaining(timeRemaining - 1);

        }

    }, 1000);

    */
    




    return (

        <>
            {!winner ?
                (


        <div className="min-w-full min-h-screen items-center overflow-x-hidden ">
            
            <audio src="/racing.mp3" typeof="audio/mpeg" autoPlay={soundStatus} muted={!soundStatus} />

            <div className="flex flex-row">

                <div
                    className="flex flex-col w-full justify-center items-start gap-2 relative "
                    style={{
                        backgroundImage: `url('/grass.jpeg')`,
                        backgroundSize: "150px",
                    }}
                >
                    {/* //? Finish line */}
                    <div className={`absolute h-2/3 w-4  bg-[url(/finish.png)] top-1/3 duration-1000 transition-all ease-linear ${finishLine ? " right-0 " : "-right-[16px]"}`}></div>


                    <div className="
                        flex md:h-40 w-full items-center justify-center relative
                    ">

                        <div className="flex flex-col gap-0 border-red-100">

                            <div
                                className={`flex items-center justify-center  bg-black h-[36px] text-center text-xl px-5 text-[#BA8E09] border border-[#BA8E09] `}
                            >
                                <span className="text-[#ffffff]">
                                    {Number(betPrice).toFixed(2)}
                                </span>&nbsp;&nbsp;<span>USDT</span>
                            </div>

                            <div
                                className={`flex items-center justify-center  bg-black h-[36px] text-center text-xl px-5 text-[#BA8E09] border border-[#BA8E09] `}
                            >
                                <span className="text-[#ffffff]">{currentPrice.toFixed(2)}</span>&nbsp;&nbsp;<span>USDT</span>
                            </div>

                        </div>




                        <div className="
                            absolute right-0 md:right-10 flex flex-col text-center items-center justify-center fill-gray-200 text-gray-200
                            "
                            onClick={() => {
                                setSoundStatus(!soundStatus)
                            }}
                        >

                            {soundStatus ? <> <BsFillVolumeUpFill className="w-8 h-8" /> Sound On </> : <> <BsFillVolumeMuteFill className="w-8 h-8" /> Sound Off</>}
                        
                        </div>

                        <div className="
                            md:h-40 md:w-full xl:w-2/3 md:mt-5 rounded-xl gap-1 flex-col flex lg:px-5 bg-gradient-to-t from-black to-transparent
                        ">


                            <div className="flex-row m-2 flex gap-3 border-red-100 ">

                                {horses
                                    .sort((a: any, b: any) => a.progress - b.progress)
                                    .map((horse: any, index: number) => {
                                        return (
                                            <div key={index} className="md:h-28 w-full xl:w-1/5 md:border-[2px] p-2 rounded-md flex-col flex">
                                                <div className="flex-row w-7 h-7


                                                bg-white

                                                
                                                rounded-full items-center justify-center text-center"
                                                
                                                >
                                                    {horse.id}
                                                </div>


                                                <div className="flex-col w-full items-center justify-center hidden md:flex">
                                                    <Image
                                                        src={`/rabbit${horse.id}.gif`}
                                                        width="40"
                                                        height="40"
                                                        alt={"at"}
                                                    />
                                                    
                                                    <div className="bg-white mt-1 px-5 rounded-md text-sm shadow-lg">
                                                        {horse.name}
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })
                                }

                            </div>


                            <div className="flex items-center justify-center text-center">
                            </div>

                        </div>

                    </div>
                    
                    <div className="w-full h-10 mt-0 ">
                        <div className="marquee-container relative w-full">
                            <div className="marquee ">

                                {/*
                                <span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet culpa voluptates quis incidunt officiis optio fugiat voluptatum enim aliquid reprehenderit, praesentium repudiandae cum velit quos dicta eum quasi suscipit consectetur.
                                </span>
                                */}

{/*
                                <div className="w-full h-10 mt-0 "
                                    style={{
                                            backgroundImage: `url('/lbank-logo.png')`,
                                            backgroundSize: "100px",
                                            backgroundRepeat: "repeat-x",
                                        }}
                                ></div>
                                    */}
                                <div className="w-full h-10 mt-0 "
                                    style={{
                                            backgroundImage: `url('/cracle-logo.png')`,
                                            backgroundSize: "100px",
                                            backgroundRepeat: "repeat-x",
                                        }}
                                ></div>

                            </div>

                        </div>
                    </div>
                    
                    


                    <div className="w-full h-5 mt-0 ">

                        <div
                            className={`flex items-center justify-center  bg-black h-[36px] text-center text-xl px-5 text-[#BA8E09] border border-[#BA8E09] `}
                        >
                            <span>TIME REMAINING:</span>&nbsp;&nbsp;&nbsp; <span className="text-[#ffffff]">{timeRemaining.toFixed(2)}</span>&nbsp;&nbsp;<span>Seconds</span>
                        </div>

                        {/*
                        <div
                            className={`flex items-center justify-center  bg-black h-[36px] text-center text-xl px-5 text-[#BA8E09] border border-[#BA8E09] `}
                        >
                            <span>ENTRY PRICE(ETH):</span>&nbsp;&nbsp;&nbsp; <span className="text-[#ffffff]">{betPrice.toFixed(2)}</span>&nbsp;&nbsp;<span>USDT</span>
                        </div>

                        <div
                            className={`flex items-center justify-center  bg-black h-[36px] text-center text-xl px-5 text-[#BA8E09] border border-[#BA8E09] `}
                        >
                            <span>CURRENT PRICE(ETH):</span>&nbsp;&nbsp;&nbsp; <span className="text-[#ffffff]">{currentPrice.toFixed(2)}</span>&nbsp;&nbsp;<span>USDT</span>
                        </div>
                        */}

                    </div>


                    <div className="w-full h-14 mt-8"
                        style={{
                            backgroundImage: `url('/fence4.png')`,
                            backgroundSize: "120px",
                            backgroundRepeat: "repeat-x",
                            backgroundPosition: `${finishLine ? "0px" : `${fence}%`} 0px`,
                        }}
                    ></div>

                    <div
                        className="flex min-w-[150px] items-end justify-end -mt-10"
                        style={{
                            width: `${progress1}%`,
                        }}
                    >

                        <Image
                            src={
                                imageRabbit1
                            }
                            width={150}
                            height={150}
                            alt={"at"}
                        />



{/*
                        <span className="text-green-500"  >1: Long</span>&nbsp;&nbsp;
                        <span className="text-green-500" >{betAmountLong}</span>
                        */}
                    </div>

                    <div
                        className="flex min-w-[150px] items-end justify-end "
                        style={{
                            width: `${progress2}%`,
                        }}
                    >

                        <Image
                            src={
                                imageRabbit2
                            }
                            width={150}
                            height={150}
                            alt={"at"}
                        />

{/*
                        <span className="text-red-500" >2: Short</span>&nbsp;&nbsp;
                        <span className="text-red-500" >{betAmountShort}</span>
                        */}
                        
                    </div>


{/*
                    <div
                        className="flex  min-w-[150px] items-end justify-end"
                        style={{
                            width: `${progress3}%`,
                        }}
                    >
                        <Image src={"/at3.gif"} width="150" height="150" alt={"at"} />
                    </div>

                    <div
                        className="flex  min-w-[150px] items-end justify-end"
                        style={{
                            width: `${progress4}%`,
                        }}
                    >
                        <Image src={"/at4.gif"} width="150" height="150" alt={"at"} />
                    </div>

                    <div
                        className="flex  min-w-[150px] items-end justify-end"
                        style={{
                            width: `${progress5}%`,
                        }}
                    >
                        <Image src={"/at5.gif"} width="150" height="150" alt={"at"} />
                    </div>

*/}

                    <div
                        className="w-full h-14 -mt-1"
                        style={{
                            backgroundImage: `url('/fence4.png')`,
                            backgroundSize: "120px",
                            backgroundRepeat: "repeat-x",
                            backgroundPosition: `${finishLine ? "0px" : `${fence}%`} 0px`,
                        }}
                        
                    ></div>


                </div>
            </div>
        </div>

                )
                    :

                    < Winner />
            }
        </>



    );


    
}
