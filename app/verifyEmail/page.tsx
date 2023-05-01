"use client";
import React, { useEffect, useState } from "react";

import API from "@/libs/enums/API_KEY";
import { useRouter, useSearchParams } from 'next/navigation';
import DomainEnum from "@/libs/enums/domain";

import { hasCookie, getCookie } from 'cookies-next';
import { IUser } from "@/libs/interface/user";




export default function VerifyEmailPage() {

    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    const router = useRouter();


    if (!token) {
        router.push('/');
    }



    const [user, setUser] = useState<IUser>();
    
    
    useEffect(() => {

        const getUser = async () => {

            const inputs = {
                method: 'updateEmailVerified',
                API_KEY: API.key,
                userToken: getCookie('user'),
                emailToken: token
            }
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
            })
            const user = await res.json();

            if (user?.user?.success) {
                router.push('/myPage');
            } else {
                router.push('/');
            }
    
        }

        getUser();
    }, [router, token])








    return (
        <>
            <div className="flex flex-col items-center justify-center py-5 h-full text-black gap-4">


            </div>

        </>

    );


}