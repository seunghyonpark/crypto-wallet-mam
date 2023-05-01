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
import BetTables from "@/components/betHorse/betTables";
import { IGame } from '@/libs/interface/game';

///import Winner from './winner';




export default function Dashboard() {



    ////Swal.fire('승인이 완료되었습니다.', '화끈하시네요~! LongShort' + betLongShort, 'success');

    ///console.log("raceGame betLongShort===>", betLongShort);



    const MySwal = withReactContent(Swal);


    const [status, setStatus] = useState<any>();

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
    const [soundStatus, setSoundStatus] = useState(true);
    const [finishLine, setFinishLine] = useState(false);

    const [currentPrice, setCurrentPrice] = useState<any>(1682.32);

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


    const [games, setGames] = useState<any>()

    
    
  

    useEffect(() => {

        const getGames = async () => {
            const res = await fetch('/api/game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify({
                    method: "getGames",
                    API_KEY: process.env.API_KEY
                })
            })
            const data = await res.json()
            setGames(data.games)
        }
    
      
        getGames();
      
        const interval = setInterval(getGames, 1000);
      
        return () => {
          clearInterval(interval);
      
        }
      
    }, [games]);
    

    const getGames = async () => {
        const res = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify({
                method: "getGames",
                API_KEY: process.env.API_KEY
            })
        })
        const data = await res.json()
        setGames(data.games)
    }

    
    setTimeout(() => {
        ///getGames();
    }, 10000);
    

/*
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



    }, 40);
    //}, 1000);
*/


   
    
    /*
    useEffect(() => {

        console.log("raceGame useEffect socket id", socket.id);

        socket.on('status', (data: any) => {

            console.log("raceGame status", data);

            setStatus(data);

            
        });


        socket.on('baseprice', (data: any) => {

            ////console.log("raceGame baseprice", data);

            setBasePrice(data);

        });


        socket.on("winner", (data: any) => {
            console.log("raceGame winner", data);

            setWinner(data);

            let textResult = "";
            let imageUrl = "";

            if (data === selectedSide) { // You win
                textResult = "You win";
                imageUrl = "/winner.gif";

                push( '/gameT2E/winner?bet=' + selectedSide + '&betAmount=' + betAmount );

            } else { // You lose
                textResult = "You lose";
                imageUrl = "/loser.gif";

                push( '/gameT2E/loser?bet=' + selectedSide + '&betAmount=' + betAmount );
            }

        })

        socket.on("horse1", (data: any) => {
            ////console.log("Race socketInitializer horse1", data);
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

    */

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

                push( '/gameT2E/winner?bet=' + betLongShort + '&betAmount=' + betAmount );

            } else { // You lose
                textResult = "You lose";
                imageUrl = "/loser.gif";

                push( '/gameT2E/loser?bet=' + betLongShort + '&betAmount=' + betAmount );
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


    
                    




<div className="w-full h-8 mt-0"
    style={{
        //backgroundImage: `url('/cracle-banner.png')`,
        backgroundImage: `url('/cracle-banner.png')`,
        backgroundSize: "120px",
        backgroundRepeat: "repeat-x",
        backgroundPosition: `${finishLine ? "0px" : `${fence}%`} 0px`,
    }}
></div>
                    




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

    <ul className='flex flex-col list-disc min-h-[400px] '>

    {
        games?.map((game: IGame, i: number) => {


            return (

                <li key={i} >

                    <div className="w-full h-20 mt-0 ">

                        <div
                            className="flex min-w-[250px] items-end justify-end -mt-10 ml-5"
                            style={{
                                width: `${progress1}%`,
                            }}
                        >
                            <Image
                                src={
                                    game.selectedSide === "Long" ? imageRabbit1 : imageRabbit2
                                }
                                width={50}
                                height={50}
                                alt={"at"}
                            />
                            <div
                            className="flex flex-row gap-2 text-xs text-white w-full ml-2 mb-2"
                            >
                                <div>Better: {`${game.username}`}</div>
                                {/*<li className='text-yellow-500'>Entry: {game.entry}</li>*/}
                                <div className=' text-yellow-500  '>Position: {game.selectedSide}</div>
                                <div className='text-yellow-500'>Bet: {game.betAmount}</div>
                                
                            </div>
                        </div>

                    </div>
          
                </li>


            )


        })
    }
    </ul>



    <div
                        className="w-full h-14 mt-10 "
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
