'use client';
import { Tooltip } from '@mui/material'
import React from 'react'

export default function GeneralSettings() {
    
    return (
        <>
            <div className='flex flex-col items-center p-5 w-full h-full gap-10'>
                <h1 className='font-bold italic text-2xl w-full text-start'>General Settings</h1>
                <div className='flex flex-col lg:flex-row gap-5  justify-center w-full lg:w-2/3'>


                    {/* //? General ENUM Settings */}
                    <div className='flex flex-col gap-5 w-full'>

                        {/* //? Coin ENUM Settings */}
                        <div className='flex flex-col p-4 border gap-5 rounded-lg w-full'>
                            <h2 className='font-medium text-xl text-gray-200'>Coin Settings</h2>
                            <div className='flex flex-col gap-2'>

                                <label htmlFor="coinName" className=''>Coin Name</label>
                                <input type="text" id='coinName' className='input border-white border placeholder:text-gray-500 italic' value='Cracle' />

                                <label htmlFor="coinSymbol" className='mt-5'>Coin Symbol</label>
                                <input type="text" id='coinSymbol' className='input border-white border placeholder:text-gray-500 italic' value='CRA' />

                                <label htmlFor="ratio" className='mt-5'>Multiple Ratio</label>
                                <input type="number" id='ratio' className='input border-white border placeholder:text-gray-500 italic' value={8} />
                            </div>
                            <Tooltip title="DEMO" arrow>
                                <button className='btn w-full btn-primary'>Submit</button>
                            </Tooltip>
                        </div>

                        {/* //? Bot Socket Settings */}
                        {/*
                        <div className='flex flex-col p-4 border gap-5 rounded-lg w-full'>
                            <h2 className='font-medium text-xl text-gray-200'>Bot Socket</h2>
                            <div className='flex flex-col gap-2'>

                                <label htmlFor="socketIp" className=''>Socket IP</label>
                                <input type="text" id='socketIp' className='input border-white border placeholder:text-gray-500 italic' value='129.0.0.1:5001' />
                            </div>
                            <Tooltip title="DEMO" arrow>
                                <button className='btn w-full btn-secondary'>Submit</button>
                            </Tooltip>
                        </div>
                        */}
                    </div>


                    {/* //? Horse ENUM Settings */}
                    <div className='flex flex-col p-4 border gap-5 rounded-lg w-full'>
                        <h2 className='font-medium text-xl text-gray-200'>NFT Settings</h2>
                        <div className='flex flex-col gap-2'>

                            <label htmlFor="horse1" className='mt-5'>Long Rabbit Name</label>
                            <input type="text" id='horse1' className='input border-white border placeholder:text-gray-500 italic' value='뉴진스' />

                            <label htmlFor="horse2" className='mt-5'>Short Rabbit Name</label>
                            <input type="text" id='horse2' className='input border-white border placeholder:text-gray-500 italic' value='애스파' />

                        </div>
                        <Tooltip title="DEMO" arrow>
                            <button className='btn w-full btn-success'>Submit</button>
                        </Tooltip>
                    </div>


                </div>
            </div>
        </>
    )
}
