'use client';
import { Tooltip } from '@mui/material';
import React from 'react';
import { hasCookie, getCookie } from 'cookies-next';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


import { useFormik } from "formik";
import * as Yup from "yup";


// Yup schema to validate the form
const schema = Yup.object().shape({

    currentPassword: Yup.string()
        .required(),
        ///.min(7),
    pass1: Yup.string()
        .required()
        .min(7),
    pass2: Yup.string()
        .required()
        .min(7),
});

export default function MyPage() {

    const router = useRouter();


    // Formik hook to handle the form state
    const formik = useFormik({
        
        ////console.log("useFormik===========");

        initialValues: {
            currentPassword: "",
            pass1: "",
            pass2: "",
        },

        // Pass the Yup schema to validate the form
        validationSchema: schema,

        // Handle form submission
        onSubmit: async ({ currentPassword, pass1, pass2}) => {
            // Make a request to your backend to store the data

            let userToken = getCookie("admin");


            //console.log("pass1: " + pass1)
            //console.log("pass2: " + pass2)
            //console.log("userToken: " + userToken)



            const formInput = {
                method: 'updatePassword',
                API_KEY: process.env.API_KEY,
                currentPassword: currentPassword,
                pass1: pass1,
                pass2: pass2,
                userToken: userToken,
            };
            fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formInput),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.user) {
                        alert(data.message);
                        //handleClickSucc();
                        router.push("/admin");
                    }
                    else {

                        alert(data.message);
                        //setErrMsg(data.message);
                        //handleClickErr();
                    }
                    //todo
                    // handleClickSucc();
                });


        },
    });

    // Destructure the formik object
    const { errors, touched, values, handleChange, handleSubmit } = formik;

    
    return (
        <>
            <div className='flex flex-col items-center p-5 w-full h-full gap-10'>
                <h1 className='font-bold italic text-2xl w-full text-start'>My Page</h1>
                <div className='flex flex-col lg:flex-row gap-5  justify-center w-full lg:w-1/3'>

                    {/* //? Password Settings */}
                    <div className='flex flex-col p-4 border gap-5 rounded-lg w-full'>
                        <h2 className='font-medium text-xl text-gray-200'>Change Password</h2>


                        <form
                            className="mt-5"
                            onSubmit={handleSubmit} method="POST">

                            <div className='flex flex-col gap-2'>

                                <label className='mt-5'>Current password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    id='currentPassword'
                                    className='input border-white border placeholder:text-gray-500 italic'
                                    value={values.currentPassword}
                                    onChange={handleChange}
                                />
                                {errors.currentPassword && touched.currentPassword && <span>{errors.currentPassword}</span>}


                                <label className='mt-5'>New password</label>
                                <input
                                    type="password"
                                    name="pass1"
                                    id='pass1'
                                    className='input border-white border placeholder:text-gray-500 italic'
                                    value={values.pass1}
                                    onChange={handleChange}
                                />
                                {errors.pass1 && touched.pass1 && <span>{errors.pass1}</span>}


                                <label className='mt-5'>Re-enter new password</label>
                                <input
                                    type="password"
                                    name="pass2"
                                    id='pass2'
                                    className='input border-white border placeholder:text-gray-500 italic'
                                    value={values.pass2}
                                    onChange={handleChange}
                                />
                                {errors.pass2 && touched.pass2 && <span>{errors.pass2}</span>}

                            </div>


                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white text-center justify-center m-5 p-5 rounded-md ">
                                    Submit
                            </button>

                        </form>


{/*
                        <Tooltip title="DEMO" arrow>

                            <button className='btn w-full btn-success'>Submit</button>


                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white text-center justify-center m-5 p-5 rounded-md ">
                                    Submit
                            </button>


                        </Tooltip>
*/}
                    </div>


                </div>
            </div>
        </>
    )
}
