"use client";
import Horses from "@/libs/enums/horses.enums";
import SocketEnum from "@/libs/enums/socket";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
//@ts-ignore
import { io } from "socket.io-client";
import { BsFillVolumeUpFill, BsFillVolumeMuteFill } from "react-icons/bs";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useRouter } from 'next/navigation';

import Winner from './winner';




export default function Race({socket, username, currentPrice, betPrice}: {socket: any, username: any, currentPrice: any, betPrice: any}) {



    ////Swal.fire('승인이 완료되었습니다.', '화끈하시네요~! LongShort' + betLongShort, 'success');

    ///console.log("raceGame betLongShort===>", betLongShort);



    const MySwal = withReactContent(Swal);


    ////const [status, setStatus] = useState<any>();

    const [basePrice, setBasePrice] = useState<any>(0);


    const [progress1, setProgress1] = useState<any>(0);
    const [progress2, setProgress2] = useState<any>(0);
    //const [progress3, setProgress3] = useState<any>(0);
    //const [progress4, setProgress4] = useState<any>(0);
    //const [progress5, setProgress5] = useState<any>(0);

    const [fence, setFence] = useState(0);
    const [track, setTrack] = useState(0);
    const [horses, setHorses] = useState<any>([]);
    const [winner, setWinner] = useState<any>();
    const [soundStatus, setSoundStatus] = useState(false);
    const [finishLine, setFinishLine] = useState(false);

    /////const [currentPrice, setCurrentPrice] = useState<any>(1682.32);

    const [betAmountLong, setBetAmountLong] = useState<any>("");
    const [betAmountShort, setBetAmountShort] = useState<any>("");

    const [betAmount, setBetAmount] = useState<any>(0);

    const [selectedSide, setSelectedSide] = useState<any>();

    const [timeRemaining, setTimeRemaining] = useState<any>(0.00);


    const [imageRabbit1, setImageRabbit1] = useState<any>("");
    const [imageRabbit2, setImageRabbit2] = useState<any>("");


    const [isPlaying1, setIsPlaying1] = useState(false);

    const audioRef1 = useRef<HTMLAudioElement>(null);
    ////const audioRef1 = useState<any[]>([]); //useRef(null);

    

    const [isPlaying2, setIsPlaying2] = useState(false);

    const audioRef2 = useRef<HTMLAudioElement>(null);
    //const audioRef2 = useState<any[]>([]); //useRef(null);

   
    /////const [socket, setSocket] = useState<any>();


    //console.log("selectSide", selectSide);


    const { push } = useRouter();

    const [game, setGame] = useState<any>();

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

        const getGame = async () => {
            
            console.log("raceGame getGame()");

       
          const res = await fetch('/api/game', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              cache: 'no-store',
              body: JSON.stringify({
                  method: "getGameByUsername",
                  API_KEY: process.env.API_KEY,
                  username: username,
              })
          })
          const data = await res.json()

          setGame(data.game);
          setSelectedSide(data.game.selectedSide);
          setBetAmount(data.game.betAmount);
        }

        getGame();

      }, [username]);




    useEffect(() => {
        if (isPlaying1) {
            if (audioRef1.current != null) {
                audioRef1.current.play();
            }
        } else {
            if (audioRef1.current != null) {
                audioRef1.current.pause();
            }
        }

        if (isPlaying2) {
            if (audioRef2.current != null) {
                audioRef2.current.play();
            }
        } else {
            if (audioRef2.current != null) {
                audioRef2.current.pause();
            }
        }
    
        if (audioRef1.current != null) {
            audioRef1.current.onended = () => {
            setIsPlaying1(false);
            };
        }

        if (audioRef2.current != null) {
            audioRef2.current.onended = () => {
                setIsPlaying2(false);
            };
        }

    }, [isPlaying1, isPlaying2, audioRef1, audioRef2]);


    useEffect(() => {

        //console.log("betLongShort", betLongShort);
        //console.log("betAmount", betAmount);

        if (selectedSide === "Long") {
            setBetAmountLong("My Rabbit: " + betAmount);
            setBetAmountShort("");
        } else if (selectedSide === "Short") {
            setBetAmountShort("My Rabbit: " + betAmount);
            setBetAmountLong("");
        }
        
    }, [selectedSide, setBetAmountLong, setBetAmountShort, betAmount]);


    setTimeout(() => {
        setHorses([
            { id: 1, progress: progress1, name: `${Horses.Horse1}`, image: imageRabbit1 },
            { id: 2, progress: progress2, name: `${Horses.Horse2}`, image: imageRabbit2 },
            //{ id: 3, progress: progress3, name: `${Horses.Horse3}` },
            //{ id: 4, progress: progress4, name: `${Horses.Horse4}` },
            //{ id: 5, progress: progress5, name: `${Horses.Horse5}` },
        ]);

        /*
        const price = 1682.32 + progress1-progress2;
        setCurrentPrice(price);
        */

    }, 40);
    //}, 1000);


   
    

    useEffect(() => {

        console.log("raceGame useEffect socket id", socket.id);

        socket.on('status', (data: any) => {

            console.log("raceGame status", data);

            ///setStatus(data);

            
        });


        socket.on('baseprice', (data: any) => {

            ////console.log("raceGame baseprice", data);

            setBasePrice(data);

        });

        socket.on("prizeAmount", (data: any) => {

            if (parseInt(data) > 0) { // You win

                push( '/gameT2E/winner?bet=' + selectedSide + '&betAmount=' + betAmount );

            } else { // You lose

                push( '/gameT2E/loser?bet=' + selectedSide + '&betAmount=' + betAmount );
            }

        });




        socket.on("winner", (data: any) => {
            console.log("raceGame winner", data);

            setWinner(data);


            /*
            let textResult = "";
            let imageUrl = "";

            if (data === selectedSide) { // You win
                textResult = "You win";
                imageUrl = "/winner.gif";

                push( '/Landing/winner?bet=' + selectedSide + '&betAmount=' + betAmount );

            } else { // You lose
                textResult = "You lose";
                imageUrl = "/loser.gif";

                push( '/Landing/loser?bet=' + selectedSide + '&betAmount=' + betAmount );
            }
            */

        })

        socket.on("horse1", (data: any) => {
            ///console.log("Race socketInitializer horse1", data);
            setProgress1(data);

            
        });

        socket.on("horse2", (data: any) => {
            //console.log("Race socketInitializer horse2", data);
            setProgress2(data);
        });

        socket.on("timer", (data: any) => {

            ///console.log(socket.id + " raceGame timer", data);

            // 60 seconds
            if ( (60000 - (data*1000) ) > 0) {
                setTimeRemaining( (60000 - (data * 1000)) / 1000);
            } else {
                setTimeRemaining(0);
            }

        });


        //////setSocket(socketIo);
    
    }, [socket, betAmount, selectedSide, push]);

    /*
    useEffect(() => {
        return (() => {
            if (socket) {
                socket.disconnect();
            }
        })
    }, [socket]);
    */

    



    /////useEffect(() => socketInitializer(), []);

    /*
    const socketInitializer = () => {

        const socket = io(`${SocketEnum.id}`, {
            transports: ["websocket"],
        });

        socket.on("connect", () => {

            console.log("raceGame socketInitializer connect socket.id", socket.id);

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

                push( '/Landing/winner?bet=' + betLongShort + '&betAmount=' + betAmount );

            } else { // You lose
                textResult = "You lose";
                imageUrl = "/loser.gif";

                push( '/Landing/loser?bet=' + betLongShort + '&betAmount=' + betAmount );
            }

        })

        socket.on("horse1", (data: any) => {
            //console.log("Race socketInitializer horse1", data);
            setProgress1(data);



        });

        socket.on("horse2", (data: any) => {
            //console.log("Race socketInitializer horse2", data);
            setProgress2(data);

        });

        socket.on("timer", (data: any) => {
            console.log(socket.id + " Race timer", data);
           
            ///setProgress5(data);

            
            //if ( (90000 - (data*1000) ) > 0) {
            //    setTimeRemaining( (90000 - (data * 1000)) / 1000);
            //} else {
            //    setTimeRemaining(0);
            //}

            // 60 seconds
            if ( (60000 - (data*1000) ) > 0) {
                setTimeRemaining( (60000 - (data * 1000)) / 1000);
            } else {
                setTimeRemaining(0);
            }


        });

    };
    */


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

            setIsPlaying1(true);
            setIsPlaying2(false);


            setImageRabbit1("/rabbit1_winning.gif");
            setImageRabbit2("/rabbit2_losing.gif");

        } else if ( (progress2-progress1) > 0) {

            setIsPlaying2(true);
            setIsPlaying1(false);

            setImageRabbit1("/rabbit1_losing.gif");
            setImageRabbit2("/rabbit2_winning.gif");

        } else {
            setImageRabbit1("/rabbit1.gif");
            setImageRabbit2("/rabbit2.gif");
        }


    }, [progress1, progress2])



    setTimeout(() => {
        setFence(fence - 1);
        setTrack(track - 1);
    }, 60);



    /*
    setTimeout(() => {

        if (timeRemaining > 0) {

            setTimeRemaining(timeRemaining - 1);

        }

    }, 1000);

    */
    


    


    return (


        <div className="min-w-full min-h-screen items-center overflow-x-hidden ">
            
            <audio src="/racing.mp3" typeof="audio/mpeg" autoPlay={soundStatus} muted={!soundStatus} />

            <audio src="/shouting1.wav" ref={audioRef1} autoPlay={soundStatus} muted={!soundStatus} />
            <audio src="/shouting2.wav" ref={audioRef2} autoPlay={soundStatus} muted={!soundStatus} />

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
                                className={`flex flex-row items-center justify-center  bg-black h-[36px] text-center text-sm px-5 text-[#BA8E09] border border-[#BA8E09] `}
                            >
                                <span className="text-white text-left w-[60px] ">ENTRY :</span>
                                <span className="text-[#ffffff] text-xl">
                                    {Number(basePrice).toFixed(2)}
                                </span>
                                &nbsp;&nbsp;<span>USDT</span>
                            </div>

                            <div
                                className={`flex flex-row items-center justify-center  bg-black h-[36px] text-center text-sm px-5 text-[#BA8E09] border border-[#BA8E09] `}
                            >
                                <span className="text-white text-left w-[60px] ">NOW :</span>
                                <span
                                    className="text-[#ffffff] text-xl"
                                    style={{
                                        color: `${ (basePrice - currentPrice) === 0 ? "#ffffff" : (basePrice - currentPrice) > 0 ? "#ff0000" : "#00ff00"}`,
                                    }}
                                >
                                        {Number(currentPrice).toFixed(2)}
                                </span>
                                &nbsp;&nbsp;
                                <span>USDT</span>
                            </div>

                        </div>




                        <div className="
                            absolute right-3 md:right-10 flex flex-col text-center text-xs items-center justify-center fill-gray-200 text-gray-200
                            "
                            onClick={() => {
                                setSoundStatus(!soundStatus)
                            }}
                        >

                            {soundStatus ? <> <BsFillVolumeUpFill className="w-5 h-5" /> Sound On </> : <> <BsFillVolumeMuteFill className="w-5 h-5" /> Sound Off</>}
                        
                        </div>


{/*
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
*/}


                    </div>
                    
                    {/*
                    <div className="w-full h-6 mt-2 ">
                            <div
                                className=" h-10 -mt-1"
                                style={{
                                    backgroundImage: `url('/cracle-logo.png')`,
                                    backgroundSize: "120px",
                                    backgroundRepeat: "repeat-x",
                                    backgroundPosition: `${finishLine ? "0px" : `${fence}%`} 0px`,
                                }}   
                            >
                        </div>
                    </div>
                            */}



<div className="w-full h-8 mt-0"
    style={{
        //backgroundImage: `url('/cracle-banner.png')`,
        backgroundImage: `url('/cracle-banner.png')`,
        backgroundSize: "120px",
        backgroundRepeat: "repeat-x",
        backgroundPosition: `${finishLine ? "0px" : `${fence}%`} 0px`,
    }}
></div>
                    
 


                    <div className="w-full h-5 mt-0 mb-5">

                        <div
                            className={`flex items-center justify-center  bg-black h-[36px] text-center text-xl px-5 text-[#BA8E09] border border-[#BA8E09] `}
                        >
                            <span>TIME LEFT:</span>&nbsp;&nbsp;&nbsp; <span className="text-[#ffffff]">{timeRemaining.toFixed(2)}</span>&nbsp;&nbsp;<span>Seconds</span>
                        </div>


                    </div>



<div className="w-full ">

    <div className="w-full h-20 mt-0 "
    
        style={{
            backgroundImage: `url('/fence4.png')`,
            backgroundSize: "120px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: `${finishLine ? "0px" : `${fence}%`} 0px`,
        }}
    >
    </div>




                    <div
                        className="flex min-w-[250px] items-end justify-end -mt-10"
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
                        <div
                        className="font-bold text-xs text-white mb-6"
                        style={{
                            opacity: `${selectedSide === "Long" ? 100 : 0}`
                        }}
                        >
                            {"MY RABBIT"}
                        </div>

                    </div>


                    {selectedSide === "Long" && (

                        <div
                            className="w-full h-14 "
                            style={{
                                backgroundImage: `url('/track.png')` ,
                                backgroundSize: "120px",
                                backgroundRepeat: "repeat-x",
                                backgroundPosition: `${finishLine ? "0px" : `${track}%`} 0px`,

                            }}

                        >
                        </div>

                    )}



                    <div
                    
                        className="flex min-w-[250px] items-end justify-end "
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
                        <div
                        className="font-bold text-xs text-white mb-6"
                        style={{
                            opacity: `${selectedSide === "Short" ? 100 : 0}`
                        }}
                        >
                            {"MY RABBIT"}
                        </div>

                        
                    </div>


                    {selectedSide === "Short" && (

                    <div
                        className="w-full h-14 "
                        style={{
                            backgroundImage: `url('/track.png')` ,
                            backgroundSize: "120px",
                            backgroundRepeat: "repeat-x",
                            backgroundPosition: `${finishLine ? "0px" : `${track}%`} 0px`,

                        }}

                    >
                    </div>

                    )}



                    <div
                        className="w-full h-14 mt-0 "
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
        </div>




    );


    
}
