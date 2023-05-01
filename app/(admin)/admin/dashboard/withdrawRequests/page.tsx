'use client';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridColDef, GridValueGetterParams, DataGrid, GridApi, GridCellValue } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { VscGear, VscError, VscCheck } from "react-icons/vsc";


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function WithdrawRequests() {
    const [requests, setRequests] = useState<any>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState<any>();


    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.01,
            minWidth: 80,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "createdAt",
            headerName: "DATE",
            align: "center",
            headerAlign: "center",
            width: 150,
            type: "dateTime",
            minWidth: 220,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleString();
            }, // burada tarih formatı değiştirilebilir.
        },

        {
            field: "email1",
            headerName: "Email",
            flex: 0.2,
            minWidth: 220,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => {

              return (
                <>
                  <span className=" w-60 justify-right">{params.value}</span>
                  <div className='flex justify-center items-center '>
                    {params.row.emailVerified ?
                        <VscCheck className=" w-5 h-5 text-green-500" />
                        :
                        <VscError className=" w-5 h-5 text-red-500" />
                    }
                  </div>
                </>
              );
            },
            
          },


        {
            field: "wallet",
            headerName: "Wallet",
            flex: 0.1,
            minWidth: 400,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "requestAmount",
            headerName: "Request",
            align: "right",
            headerAlign: "center",
            type: "number",
            flex: 0.2,
            minWidth: 100,
            /*
            renderCell(params) {
                /////return <Chip label={`${params.value}  ${params.row.type}`} color="primary" />;

                return <Chip label={`${params.value}`} color="primary" />;
            },
            */

        },
        {
            field: "withdrawFee",
            headerName: "Fee",
            align: "right",
            headerAlign: "center",
            type: "number",
            flex: 0.2,
            minWidth: 100,
            /*
            renderCell(params) {
                return <Chip label={`${params.value}  ${params.row.type}`} color="primary" />;
            },
            */

        },
        {
            field: "lastAmount",
            headerName: "Amount",
            align: "right",
            headerAlign: "center",
            type: "number",
            flex: 0.2,
            minWidth: 100,            

        },


        {
            field: "status",
            headerName: "Status",
            align: "center",
            headerAlign: "center",
            description: "This column has a value getter and is not sortable.",
            flex: 0.1,
            minWidth: 220,
            renderCell(params) {
                return <>
                    <Chip
                        label={params.value}
                        color={params.value === "Rejected" ? "error" : params.value === "Accepted and Paid" ? "info" : params.value === "Waiting" ? "warning" : "success"}
                    />
                    {params.value === "Accepted and Paid" && (
                        <Link
                            href={"https://bscscan.com/tx/"+params.row.txHash}
                            className="ml-2 flex items-center justify-center">
                            <span className="text-yellow-600 text-sm ">Tx Hash</span>
                        </Link>
                    )}
                </>
            },
        },

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
        const res = await fetch('/api/paymentRequests', {
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
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "getAll",
                API_KEY: process.env.API_KEY,
                userToken: getCookie("admin")
            }),
        })
        const data = await res.json()
        setRequests(data.payments)
    }

    useEffect(() => {
        getAll()
    }, [])


    const [withdrawSum, setWithdrawSum] = React.useState(0)

    const getAllSum = async () => {
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "getAllAmount",
                API_KEY: process.env.API_KEY,
                userToken: getCookie("admin")
            }),
        })
        const data = await res.json()

        console.log(data)

        setWithdrawSum(data.sum)
        
        //if (data.payments.length == 0) return setRequests(0)
        //setRequests(data.payments.length)
    }

    React.useEffect(() => {
        getAllSum()
    }, [])


    const rows = requests.map((item: any, i: number) => {
        return {
            kayitId: item._id,
            id: i,
            email1: item.email1,
            emailVerified: item.emailVerified,
            requestAmount: item.withdrawAmount,
            withdrawFee: item.withdrawFee,
            lastAmount: item.withdrawAmount - item.withdrawFee,
            type: item.type,
            status: item.status,
            wallet: item.walletTo,
            createdAt: item.createdAt,
            txHash: item.txHash,
            userToken: item.userToken,
            gonderildi: item.gonderildi,
        }
    })

    return (
        <>
            <div className='flex flex-col p-10 mt-5 text-gray-200'>
                <h1 className='font-bold italic text-2xl'>Withdraw Requests</h1>

                <h1 className='font-bold italic text-2xl'>Total Withdraw Amount: {Number(withdrawSum).toFixed(2)}</h1>



                <div style={{ width: "100%", height: 2710, color: "white" }}>

                {rows && (

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={50}
                        rowsPerPageOptions={[10]}
                        hideFooterSelectedRowCount
                        sx={{
                            bgcolor: "white", //table background color
                            boxShadow: 2,
                            border: 2,
                            borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                              color: 'primary.main',
                            },

                            
                            ///color: "white",
                        }}
                    />
                )}

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
                    <DialogTitle> Withdraw Request from {selectedUser?.email1}</DialogTitle>
                    <DialogContent className='space-y-3'>
                        <DialogContentText>
                            ID(E-mail): <span className='font-bold italic'> {selectedUser?.email1} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Request Amount: <span className='font-bold italic'> {selectedUser?.requestAmount} </span>
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
                        {/*
                        <Button color='error' onClick={deleteRequest}>Delete</Button>
                        */}
                        <Button color='error' onClick={requestRejected}>Reject</Button>
                        <Button onClick={handleClose}>Close</Button>
                        <Button color='success' onClick={requestAccepted}>Save</Button>
                    </DialogActions>
                </Dialog>
            )}




        </>
    )
}

