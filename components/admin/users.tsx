'use client';
import DomainEnum from '@/libs/enums/domain';
import Link from 'next/link'
import React from 'react'


export default function AdminUsers() {

    const [data, setData] = React.useState(0);
    
    async function getData() {
        const res = await fetch(DomainEnum.address + '/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "getAll",
                API_KEY: process.env.API_KEY,
            }),
        });
        const cevap = await res.json();
        if (cevap.users.success) {
            setData(cevap.users.users.length)
        } else {
            // todo 
            //!error
        }
    }

    if (data == 0) getData();

    return (
        <>
            <div className='flex flex-col items-center gap-3  border rounded-lg p-4 w-full h-full'>
                <div className='text-ml'> Users</div>
                <p>Current: <span className='text-blue-500'>{data}</span></p>
                <Link href="/admin/dashboard/users" className='btn btn-md btn-primary'>See All</Link>
            </div>
        </>
    )
}
