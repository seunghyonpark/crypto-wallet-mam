'use client';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridColDef, GridValueGetterParams, DataGrid, GridApi, GridCellValue } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import Link from 'next/link';


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function MyPage() {
    const [requests, setRequests] = useState<any>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState<any>();


    const columns: GridColDef[] = [
 

        {
            field: "date",
            headerName: "DATE",
            align: "center",
            headerAlign: "center",
            width: 70,
            type: "dateTime",
            minWidth: 100,
            valueFormatter: (params) => {

                var date = new Date(params.value);
                //.toLocaleString();

                return format(date, "HH:mm:ss");

                //return new Date(params.value).toLocaleString();

            }, // burada tarih formatı değiştirilebilir.
        },

        {
            field: "betAmount",
            type: "number",
            headerName: "BET",
            flex: 0.1,
            minWidth: 60,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "basePrice",
            type: "number",
            headerName: "ENTRY",
            flex: 0.1,
            minWidth: 80,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "prizeAmount",
            type: "number",
            headerName: "RESULTS",
            flex: 0.1,
            minWidth: 60,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "selectedSide",
            headerName: "L/S",
            align: "center",
            headerAlign: "center",
            flex: 0.2,
            minWidth: 100,
            /*
            renderCell(params) {
                return <Chip label={`${params.value}  ${params.row.type}`} color="primary" />;
            },
            */
            
        },

        /*
        {
            field: "winnerHorse",
            headerName: "Result",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
            minWidth: 100,

        },
        */



        /*
        {
            field: "action",
            headerName: "Edit",
            align: "center",
            headerAlign: "center",
            sortable: false,
            width: 125,
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation(); // don't select this row after clicking

                    const api: GridApi = params.api;
                    const thisRow: Record<string, GridCellValue> = {};

                    api
                        .getAllColumns()
                        .filter((c) => c.field !== "__check__" && !!c)
                        .forEach(
                            (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                        );

                    return duzenle(params.row);
                };
                return (
                    <Button color="success" variant='contained' className='bg-green-500' onClick={onClick}>
                        Edit
                    </Button>
                );
            },
        },
        */

    ];

    function duzenle(e: any) {
        setSelectedUser(e)
        handleClickOpen()
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const requestAccepted = async () => {
        let hash = (document.getElementById("hash") as HTMLInputElement).value;
        let isPay = (document.getElementById("isPay") as HTMLInputElement).checked;

        const formInputs = {
            method: "update",
            _id: selectedUser.kayitId,
            userToken: selectedUser.userToken,
            txHash: hash,
            status: hash.length > 3 && isPay ? "Accepted and Paid" : isPay ? "Accepted" : "Waiting",
            gonderildi: isPay,
            API_KEY: process.env.API_KEY,
        }
        const res = await fetch('/api/bethistory', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formInputs)
        })
        const data = await res.json()
        handleClose()
        getAll()
    }

    const requestRejected = async () => {

        let isPay = false;
        let hash = "empty";
        let status = "Rejected"

        const formInputs = {
            method: "reject",
            _id: selectedUser.kayitId,
            userToken: selectedUser.userToken,
            txHash: hash,
            status: status,
            gonderildi: isPay,
            API_KEY: process.env.API_KEY,
        }
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formInputs)
        })
        const data = await res.json()
        handleClose()
        getAll()
    }

    const deleteRequest = async () => {
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "delete",
                API_KEY: process.env.API_KEY,
                _id: selectedUser.kayitId,
            }),
        })
        const data = await res.json()
        handleClose()
        getAll()
    }

    const getAll = async () => {
        const res = await fetch('/api/bethistory', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "getAll",
                API_KEY: process.env.API_KEY,
                userToken: getCookie("user")
            }),
        })
        const data = await res.json();

        //console.log("data=>", data  );

        ///console.log("betHistory=>", data.betHistory, "user=>", getCookie("user")  );

        setRequests(data.betHistory)
    }

    useEffect(() => {
        getAll();
    }, [])


    const rows = requests.map((item: any, i: number) => {
        return {
            kayitId: item._id,
            id: i,
            betAmount: item.betAmount,
            basePrice: item.basePrice,
            prizeAmount: item.prizeAmount,
            selectedSide: item.selectedSide,
            winnerHorse: item.winnerHorse,
            date: item.date,
            userToken: item.userToken,
        }
    })
    

    return (
        <>

            
<div className='flex flex-col p-0 mt-0 text-gray-200'>



<div className="w-full rounded-lg flex flex-col items-center justify-center p-2 gap-1 py-5">
    <h4 className="  text-white text-xl font-bold">
    Now connected with <br/> 
    0x7289…1A0B

    </h4>

    <h4 className=" text-white text-xl font-bold">
    Banking
    </h4>
    <h4 className=" text-white text-xl font-bold">
    <Link href={"/Landing/deposit"}>
    Deposit
    </Link>
    </h4>
    <h4 className=" text-white text-xl font-bold">
    <Link href={"/Landing/deposit"}>
    Withdrawal
    </Link>
    </h4>
    <h4 className=" text-white text-xl font-bold ">
    <Link href={"/Landing/betHistory"}>
    History
    </Link>
    </h4>
    <h4 className=" text-white text-xl font-bold">
    Ranking
    </h4>



</div>


</div>


        </>
    )
}

