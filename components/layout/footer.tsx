'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { IUser } from '@/libs/interface/user';

import { deleteCookie, getCookie, hasCookie } from 'cookies-next';


///export default function Footer({user} : {user: any}) {

export default function Footer() {



    const [user, setUser] = useState<IUser>();


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
      const data = await res.json();

      setUser(data?.user?.user);
      
  }

  useEffect(() => {
    if (hasCookie("user") && !user) {

        getUser()
        
    }
  }, [user]);


    const router = useRouter();


    return (
        <>

            <div className="
                items-center justify-center w-full h-20 bg-black sticky top-0 z-50 
                lg:flex
                ">

                <div className='flex flex-col w-full p-10 text-gray-500 gap-5 bg-black'>
                    {/*
                    <Link href="/hipodrom" className='w-full'>
                        <Image src={"/logo.png"} width="100" height="50" alt="logo" />
                    </Link>
                    */}


                    <div className='w-full flex flex-row'>
 
                        {user &&
                            <button
                                className={` text-red-500`}
                                onClick={() => {
                                    deleteCookie('user');
                                    router.push('/');
                                }}
                            >
                                Log Out
                            </button>
                        }



                        &nbsp;&nbsp;


                        <Link href="/gameT2E/terms">
                            Terms of Services
                        </Link>


                    </div>


                    <div className="w-full">
                        <Image src={"/logo.png"} width="100" height="50" alt="logo" />
                    </div>
                    <div className='w-full flex flex-col'>
                        <p>All Rights Reserved © 2023 Cracle</p>
                    </div>
                </div>


            </div>

            <div id="modal-root"></div>

        </>
    )
}
