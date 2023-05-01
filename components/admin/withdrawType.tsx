'use client';
import DomainEnum from '@/libs/enums/domain';
import React from 'react'


export default function WithdrawType() {

    const [data, setData] = React.useState<any>();

    async function getData() {
        const res = await fetch(DomainEnum.address + '/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "get",
                API_KEY: process.env.API_KEY,
            }),
        });
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        const cevap = await res.json();
        if (cevap.status) {
            setData(cevap.settings);
        } else {
            // todo 
            //!error
        }
    }

    React.useEffect(() => {
        getData();
    }, [])

    ///if (!data) getData();

    const changeWithdrawType = async () => {
        const res = await fetch(DomainEnum.address + '/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "update",
                API_KEY: process.env.API_KEY,
                _id: data[0]?._id,
                requestType: data[0]?.requestType === "Coin" ? "Matic" : "Coin",
                chat: true
            }),
        });
        const cevap = await res.json();
        if (cevap.status) {
            getData();
        } else {
            alert("Something went wrong!")
        }
    }

    return (
        <>
            {data &&
                <div className='flex flex-col items-center gap-3 border rounded-lg p-4 w-full'>
                    <h4>Withdraw Type</h4>
                    {/*
                    <p>Current: <span className='text-green-500'> With {(data[0].requestType).toUpperCase()} Request</span></p>
            */}

                    <p>Current: <span className='text-green-500'> With {data[0]} Request</span></p>

                    <button onClick={changeWithdrawType} className='btn btn-md btn-primary'>Change</button>
                </div>
            }
        </>
    )

}


