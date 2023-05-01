import AdminUsers from '@/components/admin/users'
import AdminWithdrawRequests from '@/components/admin/witdrawRequest'
import AdminDeposit from '@/components/admin/deposit'
import AdminWithdraw from '@/components/admin/withdraw'
import AdminGas from '@/components/admin/gas'
import AdminFee from '@/components/admin/fee'
import WithdrawType from '@/components/admin/withdrawType'
import Coin from '@/libs/enums/coin.enum'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'



export default async function Admin() {

    return (
        <div className='flex flex-col w-full h-full items-center justify-center gap-3'>
            <h1>Dashboard</h1>
            <div className='flex flex-col content-center gap-3 place-items-center w-full md:w-1/2'>


                
                {/*
                <WithdrawType />
                */}

                <div className='flex gap-5 justify-center w-full h-full'>

                    <AdminUsers />
                    <AdminWithdrawRequests />

                </div>
                <div className='flex gap-5 justify-center w-full h-full'>

                    <AdminDeposit />
                    <AdminWithdraw />

                </div>
                <div className='flex gap-5 justify-center w-full h-full'>

                    <AdminGas />
                    <AdminFee />

                </div>

            </div>
        </div >
    )
}
