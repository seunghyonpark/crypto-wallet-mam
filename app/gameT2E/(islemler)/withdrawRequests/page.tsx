'use client';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridColDef, GridValueGetterParams, DataGrid, GridApi, GridCellValue } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import Link from 'next/link';
import API from "@/libs/enums/API_KEY";
import { IUser } from "@/libs/interface/user";
import DomainEnum from "@/libs/enums/domain";
import { Stack, Snackbar, Alert } from "@mui/material";

import dynamic from "next/dynamic";


 const CC = dynamic(() => import("../../../../components/copy-clipboard").then(mod => mod.CopyClipboard), { ssr: false })





const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function WithdrawRequestList() {
    const [requests, setRequests] = useState<any>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState<any>();

    const [user, setUser] = useState<IUser>();
    const [settings, setSettings] = useState<any>();

    const [wallet, setWallet] = useState<any>(null);
    
    const [waiting, setWaiting] = useState<boolean>(false);



    const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
    const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");
    const [succ, setSucc] = React.useState(false);
    const [err, setErr] = React.useState(false);



    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.01,
            minWidth: 50,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "wallet",
            headerName: "To",
            flex: 0.1,
            minWidth: 80,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "requestAmount",
            headerName: "Amount",
            align: "center",
            headerAlign: "center",
            type: "number",
            flex: 0.2,
            minWidth: 110,
            /*
            renderCell(params) {
                return <Chip label={`${params.value}  ${params.row.type}`} color="primary" />;
            },
            */

        },
        {
            field: "withdrawFee",
            headerName: "Amount",
            align: "center",
            headerAlign: "center",
            type: "number",
            flex: 0.2,
            minWidth: 80,
            /*
            renderCell(params) {
                return <Chip label={`${params.value}  ${params.row.type}`} color="primary" />;
            },
            */

        },
        
        {
            field: "status",
            headerName: "Status",
            align: "center",
            headerAlign: "center",
            description: "This column has a value getter and is not sortable.",
            flex: 0.1,
            minWidth: 100,
            renderCell(params) {
                return <Chip label={params.value} color={params.value === "Rejected" ? "error" : params.value === "Accepted" ? "info" : params.value === "Waiting" ? "warning" : "success"} />;
            },
        },
        {
            field: "createdAt",
            headerName: "Date",
            align: "center",
            headerAlign: "center",
            width: 150,
            type: "dateTime",
            minWidth: 150,
            valueFormatter: (params) => {
                ///return new Date(params.value).toLocaleString();


                var date = new Date(params.value);
            
                return format(date, "yy/MM/dd HH:mm:ss");
            }, // burada tarih formatı değiştirilebilir.
        },

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


    const paraCek = async () => {

        let miktar = (document.getElementById("withdraw") as HTMLInputElement).value;
    
        if (parseInt(miktar) < 1000) {
          setErrMsgSnackbar("Please enter a value greater than 1000");
          setErr(true);
          return;
        } else if (parseInt(miktar) > 10000) {
          setErrMsgSnackbar("Please enter a value less than 10000");
          setErr(true);
          return;
        }
        
        setWaiting(true);

        const requestType = "Coin";

        const res = await fetch('/api/paymentRequests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: "new",
            API_KEY: process.env.API_KEY,
            userToken: getCookie("user"),
            email1: user?.email,
            withdrawAmount: miktar,
            walletTo: wallet,
            /////type: settings?.requestType,
            type: requestType,
          })
        });
    
        
    
        const data = await res.json();
    
        if (data.status === false) {
          setErrMsgSnackbar(data.message);
          setWaiting(false);
          setErr(true);
        } else {
          getUser();
          setWaiting(false);
          setSucc(true);
          setSuccessMsgSnackbar("Your request has been sent successfully");

          getAll();
        }
    
      };

     
      
    const getUser = async () => {
    const inputs = {
        method: 'getOne',
        API_KEY: API.key,
        userToken: getCookie('user')
    }
    const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
    })
    const user = await res.json()
    setUser(user.user.user)
    }      


    const getSettings = async () => {
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
        const data = await res.json();
        if (data.status === false) {
          return
        } else {
          setSettings(data.settings[0]);
        }
      }


    const getAll = async () => {
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "getAllforUser",
                API_KEY: process.env.API_KEY,
                userToken: getCookie("user")
            }),
        })
        const data = await res.json()
        setRequests(data.payments)
    }

    useEffect(() => {
        getUser();
        getSettings();
        getAll();
    }, [])

    const rows = requests.map((item: any, i: number) => {
        return {
            kayitId: item._id,
            id: i,
            email1: item.email1,
            requestAmount: item.withdrawAmount,
            withdrawFee: item.withdrawFee,
            type: item.type,
            status: item.status,
            wallet: item.walletTo,
            createdAt: item.createdAt,
            txHash: item.txHash,
            userToken: item.userToken,
            gonderildi: item.gonderildi,
        }
    })


    const handleClickSucc = () => {
        setSucc(true);
    };
    
    const handleCloseSucc = (
        event?: React.SyntheticEvent | Event,
        reason?: string
        ) => {
        if (reason === "clickaway") {
            return;
        }

        setSucc(false);
    };

    const handleClickErr = () => {
        setErr(true);
    };

    const handleCloseErr = (
        event?: React.SyntheticEvent | Event,
        reason?: string
        ) => {
        if (reason === "clickaway") {
            return;
        }

        setErr(false);
    };


    return (
        <>
            <div className='flex flex-col p-10 mt-0 text-gray-200'>

                <h1 className='font-bold italic text-2xl'>Withdraw Requests{" "}
                <span className="text-sm text-red-500">(CRA)</span>{" "}
                </h1>


  

                <div className="w-full border rounded-lg flex flex-col items-center p-2 justify-center gap-5 py-10">

                    <div className='w-full max-w-xs md:w-1/2 relative'>
                        
                        <input
                        placeholder="Wallet Address"
                        onChange={(e) => {
                            setWallet(e.target.value);
                        }}
                        className="input input-bordered w-full max-w-xs text-gray-800"
                        />

                    </div>

                    

                    <input
                    type="number"
                    placeholder="Type Amount"
                    id="withdraw"
                    className="input input-bordered w-full max-w-xs text-gray-800"
                    />

                    <span className="ml-5 mr-5 content-center text-sm text-green-500">
                        Withdrawal amount is at least 1,000 ~ maximum 10,000 CRA at a time
                    </span>

                    <button onClick={paraCek} className="btn btn-accent max-w-xs w-full">Withdraw</button>

                </div>

                <h1 className='mt-5 font-bold italic text-2xl'>Lists</h1>

                <div style={{ width: "100%", height: 600, color: "white" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={9}
                        rowsPerPageOptions={[10]}
                        hideFooterSelectedRowCount
                        sx={{
                            color: "white",
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
                        <Button color='error' onClick={deleteRequest}>Delete</Button>
                        <Button color='error' onClick={requestRejected}>Reject</Button>
                        <Button onClick={handleClose}>Close</Button>
                        <Button color='success' onClick={requestAccepted}>Save</Button>
                    </DialogActions>
                </Dialog>
            )}



    <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={succ}
          autoHideDuration={6000}
          onClose={handleCloseSucc}
        >
          <Alert
            onClose={handleCloseSucc}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMsgSnackbar}
          </Alert>
        </Snackbar>
        <Snackbar open={err} autoHideDuration={6000} onClose={handleCloseErr}>
          <Alert
            onClose={handleCloseErr}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errMsgSnackbar}
          </Alert>
        </Snackbar>
    </Stack>

        </>
    )
}

