'use client';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridColDef, GridValueGetterParams, DataGrid, GridApi, GridCellValue } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { useRouter, useSearchParams } from 'next/navigation';




const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function BetHistoryList() {
    const [requests, setRequests] = useState<any>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState<any>();

    const { push } = useRouter();

    const columns: GridColDef[] = [
 

        {
            field: "date",
            headerName: "DATE",
            align: "center",
            headerAlign: "center",
            width: 160,
            type: "dateTime",
            minWidth: 150,
            valueFormatter: (params) => {

                var date = new Date(params.value);
            
                return format(date, "yyyy.MM.dd HH:mm:ss");

                //return new Date(params.value).toLocaleString();

            }, // burada tarih formatı değiştirilebilir.
        },

        {
            field: "resultAmount",
            type: "number",
            headerName: "RESULT",
            flex: 0.1,
            minWidth: 130,
            align: "right",
            headerAlign: "center",

            renderCell: (params) => {

                if (params.value < 0) {
                    return (

                        <div className='w-full flex flex-row font-bold items-right '>
                            <div className='w-full text-right text-white '>
                                - {Number(Math.abs(params.value)).toFixed(0)} 
                            </div>
                            <div className='w-[80px] text-white text-right '>
                                LOSE
                            </div>
                        </div>
                    );

                } else if (params.value > 0) {
                    return (
                        <div className='w-full flex flex-row font-bold items-right'>
                            <div className='w-full text-right justify-end text-white '>
                                + {Number(params.value).toFixed(0)}
                            </div>
                            <div className='w-[80px] text-white text-right '>
                                WIN
                            </div>
                        </div>
                    );
                }
            },
            
        },
        {
            field: "prizeFee",
            type: "number",
            headerName: "Fee",
            flex: 0.1,
            minWidth: 50,
            align: "right",
            headerAlign: "center",
            valueFormatter: (params) => {
                return new Number(params.value).toFixed(0);
            },
        },
    
        {
            field: "selectedSide",
            headerName: "SELECT",
            align: "center",
            headerAlign: "center",
            flex: 0.2,
            minWidth: 100,

            renderCell: (params) => {
                if (params.value === "Long") {
                    return (
                        <div className='font-bold text-green-500'>
                            LONG
                        </div>
                    );
                } else {
                    return (
                        <div className='font-bold text-red-500'>
                        SHORT
                    </div>
                    );
                }
            },
        },
        {
            field: "basePrice",
            type: "number",
            headerName: "ENTRY",
            flex: 0.1,
            minWidth: 80,
            align: "center",
            headerAlign: "center",
            valueFormatter: (params) => {
                return new Number(params.value).toFixed(2);
            },
        },
        {
            field: "closePrice",
            type: "number",
            headerName: "LAST",
            flex: 0.1,
            minWidth: 80,
            align: "center",
            headerAlign: "center",
            valueFormatter: (params) => {
                return new Number(params.value).toFixed(2);
            },
        },
        {
            field: "winnerHorse",
            headerName: "END",
            align: "center",
            headerAlign: "center",
            flex: 0.2,
            minWidth: 100,

            renderCell: (params) => {
                if (params.value === "Long") {
                    return (
                        <div className='font-bold text-green-500'>
                            LONG
                        </div>
                    );
                } else {
                    return (
                        <div className='font-bold text-red-500'>
                        SHORT
                    </div>
                    );
                }
            },
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
                method: "getAllforUser",
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
            resultAmount: item.prizeAmount - item.betAmount,
            prizeFee: item.prizeFee,
            selectedSide: item.selectedSide,
            closePrice: item.closePrice,
            winnerHorse: item.winnerHorse,
            date: item.date,
            userToken: item.userToken,
        }
    })


    

    return (
        <>
            <div className='flex flex-col p-10 mt-0 text-gray-200'>



                <div className="w-full border rounded-lg flex flex-col items-center justify-center p-2 gap-1 py-5">
                    <h4 className="  text-red-500 text-xl font-bold">
                        T2E <span className="text-white">GAME</span>
                    </h4>

                    <h4 className=" text-red-500 text-xl font-bold">
                        Recent Bettings
                    </h4>




                    {
                        (rows[0]?.prizeAmount - rows[0]?.betAmount) > 0 &&

                        <div className="w-full flex flex-col items-center justify-center">
                            <div className=" text-white text-xl font-extrabold">
                                WIN
                            </div>
                            <div className=" text-white text-6xl font-extrabold ">
                                + {Number(rows[0]?.prizeAmount - rows[0]?.betAmount).toFixed(0)}
                            </div>
                        </div>
                    }


                    {
                        (rows[0]?.prizeAmount - rows[0]?.betAmount) < 0 &&

                        <div className="w-full flex flex-col items-center justify-center">
                            <div className=" text-white text-xl font-extrabold">
                                LOSE
                            </div>
                            <div className=" text-white text-6xl font-extrabold ">
                                - {Number(rows[0]?.betAmount).toFixed(0)}
                            </div>
                        </div>
                    }



                    <h4 className=" text-white text-sm font-bold">
                        Betting Time:&nbsp;
                        {
                            new Date(rows[0]?.date).toLocaleString()
                            //new Date(rows[0]?.date).getTime() + 1000 * 60 * 60 * 24
                             //new Date(rows[0]?.date)
                            //format(date, "yyyy.MM.dd HH:mm:ss");
                        }
                                    
                                   
                        
                    </h4>
                    <h4 className=" text-white text-sm font-bold">
                        Entry Price: {Number(rows[0]?.basePrice).toFixed(2)}
                    </h4>
                    <h4
                        className=" text-white text-sm font-bold"
                        style={{
                            color: `${(rows[0]?.basePrice - rows[0]?.closePrice) > 0 ? "rgb(239 68 68)" : "rgb(34 197 94)" }`,
                        }}
                    >
                        Last Price: {Number(rows[0]?.closePrice).toFixed(2)} 

                    </h4>

                </div>

                <div className="w-full flex items-center justify-center p-3">

                        <button
                    onClick={() => {
                        ////paraYatir();
                        push( '/gameT2E' );
                    }}
                    className="btn btn-success max-w-xs w-full text-xl bg-color-#66CDAA hover:bg-color-#66CDAA  text-white font-bold py-2 px-4 rounded-full"
                    >
                    GO BET
                    </button>
                </div>


                <h1 className='text-sm mt-5'>YOUR BET HISTORY</h1>
                <div className="mt-5" style={{ width: "100%", height: 600, color: "white" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={9}
                        rowsPerPageOptions={[10]}
                        hideFooterSelectedRowCount
                        sx={{
                            color: "white",
                            ///bgcolor: "#343a40",
                        }}
                    />
                </div>
            </div>
            {selectedUser && (
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle> Bet Histories from {selectedUser?.email1}</DialogTitle>
                    <DialogContent className='space-y-3'>
                        <DialogContentText>
                            ID(E-mail): <span className='font-bold italic'> {selectedUser?.email1} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Deposit Amount: <span className='font-bold italic'> {selectedUser?.depositAmount} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Type: <span className='font-bold italic'> {selectedUser?.type} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Status: <span className='font-bold italic'> {selectedUser?.status} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Wallet Address: <span className='font-bold italic'> {selectedUser?.wallet} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Created At: <span className='font-bold italic'> {selectedUser?.createdAt} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Transaction Hash: <span className='font-bold italic'> {selectedUser?.txHash} </span>
                        </DialogContentText>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" defaultChecked={selectedUser?.gonderildi} id='isPay' className="checkbox checkbox-primary" />
                            <p>Payment Send?</p>
                        </div>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="hash"
                            label="Transaction Hash"
                            type="hash"
                            fullWidth
                            defaultValue={selectedUser?.txHash}
                            color='secondary'
                            variant="standard"
                        />
                    </DialogContent>

                    <DialogContentText className='text-center text-xs italic'>If you reject the request than request amount will be refund to user!</DialogContentText>
                    
                    <DialogActions>
                        <Button color='error' onClick={deleteRequest}>Delete</Button>
                        <Button color='error' onClick={requestRejected}>Reject</Button>
                        <Button onClick={handleClose}>Close</Button>
                        <Button color='success' onClick={requestAccepted}>Save</Button>
                    </DialogActions>
                    
                </Dialog>
            )}




        </>
    )
}

