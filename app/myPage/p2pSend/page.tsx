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
import { VscArrowRight, VscGear, VscCheck, VscError } from "react-icons/vsc";


import ModalAlert from '@/components/ModalAlert';

import dynamic from "next/dynamic";

 const CC = dynamic(() => import("@/components/copy-clipboard").then(mod => mod.CopyClipboard), { ssr: false })




const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function P2pSendList() {
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

    const [showModal, setShowModal] = useState(false);

    const [isDisabled, setIsDisabled] = useState(true);


    const [authCodeState, setAuthCodeState] = useState(false);
    const [authCode, setAuthCode] = useState<any>(null);

    const [emailVerified, setEmailVerified] = useState(true);


  
    function onCheck(e: any) {
        const checked = e.target.checked;
        if (checked) {
            setIsDisabled(false)
        }
        if (!checked) {
            setIsDisabled(true)   
        }
    }


    const [miktar, setMiktar] = useState<any>("");




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
            field: "requestAmount",
            headerName: "Request",
            align: "right",
            headerAlign: "center",
            type: "number",
            flex: 0.2,
            minWidth: 90,
            /*
            renderCell(params) {
                return <Chip label={`${params.value}  ${params.row.type}`} color="primary" />;
            },
            */

        },
        {
            field: "fee",
            headerName: "Fee",
            align: "right",
            headerAlign: "center",
            type: "number",
            flex: 0.2,
            minWidth: 60,
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
            minWidth: 90,
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
            field: "wallet",
            headerName: "To",
            flex: 0.1,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
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

        ////let miktar = (document.getElementById("withdraw") as HTMLInputElement).value;

        if (parseInt(miktar) < 100) {
            setErrMsgSnackbar("Please enter a value greater than 100");
            setErr(true);
            return;
        } else if (parseInt(miktar) > 1000000) {
            setErrMsgSnackbar("Please enter a value less than 1000000");
            setErr(true);
            return;
        }
        setWaiting(true);
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
            type: settings?.requestType,
            authCode: authCode,
            })
        });

    

        const data = await res.json();

        if (data.status === false) {
            setErrMsgSnackbar(data.message);
            setWaiting(false);
            setErr(true);
        } else {
            setMiktar("");
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
            fee: item.withdrawFee,
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



    const sendAuthCode = async () => {
    
        const formInput = {
            method: 'sendAuthCode',
            API_KEY: process.env.API_KEY,
            userToken: user?.userToken,
        };
        fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formInput),
        })
        .then((res) => res.json())
        .then((data) => {


            console.log(data)

            if (data.data) {
    
                setSuccessMsgSnackbar(data.message);
                handleClickSucc();

                setAuthCodeState(true);
    
            } else {
    
                setErrMsgSnackbar(data.message);
                handleClickErr();
    
            }
    
        });
    
    }



    const verifyUserByEmail = async () => {
    
        const formInput = {
            method: 'verifyUserByEmail',
            API_KEY: process.env.API_KEY,
            email: user?.email,
            authCode: authCode,
        };
        fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formInput),
        })
        .then((res) => res.json())
        .then((data) => {

            if (data?.status) {

                setEmailVerified(true);
    
            } else {

                setErrMsgSnackbar("Invalid Auth Code");
                handleClickErr();
    
            }
    
        });
    
    }



    return (
        <>
            <div className='flex flex-col p-5 mt-0 text-gray-200'>

                <div className="w-full flex flex-row items-center justify-center gap-1 mt-1">
                    <VscGear className="fill-red-500 w-5 h-5" />
                    <h1 className='font-bold text-xl'>P2P Send{" "}
                        <span className="text-sm text-green-500">(MAM)</span>{" "}
                    </h1>
                </div>

                <div className="w-full mt-2 border rounded-lg flex flex-col items-center p-4 justify-center gap-5">


                    <div className='w-full max-w-xs md:w-1/2 relative'>
                        
                        <input
                            placeholder="Wallet Address"
                            onChange={(e) => {
                                setWallet(e.target.value);
                            }}
                            className="input input-bordered w-full max-w-xs text-gray-800"
                            disabled={!emailVerified}
                        />

                    </div>

                    

                    <div className='w-full max-w-xs md:w-1/2 relative'>

                        <input
                            placeholder="Minimum 100"
                            id="withdraw"
                            value={miktar}
                            className="input input-bordered w-full max-w-xs text-gray-800"
                            onChange={(e) => {
                                setMiktar(e.target.value);
                            }}
                            disabled={!emailVerified}
                        />

                        <span className='absolute top-3 right-20 z-5 text-green-500'>MAM</span>

                        <button
                            onClick={() => {
                                user?.deposit && user?.deposit > 1000000 ? setMiktar("1000000") : setMiktar(user?.deposit)
                            }}
                            className='absolute top-3 right-5 z-5 btn btn-xs text-yellow-500 border-yellow-500 hover:bg-white bg-white '
                        >
                            Max
                        </button>

                    </div>


                    <div className="ml-5 mr-5 content-center text-sm text-green-500">
                        Send amount is minimum 100 ~ maximum 1,000,000 <span className="text-green-500">MAM</span> at a time
                    </div>

                    <div className="ml-5 mr-5 content-center text-sm text-white">
                        Fee <span className="text-lg font-bold">50</span> <span className="text-green-500">MAM</span>
                    </div>
                    <div className="ml-5 mr-5 content-center text-sm text-white">
                        Amount <span className="text-lg font-bold">{ miktar === "" || miktar < 100 ? 0 : miktar - 50 }</span> <span className="text-green-500">MAM</span>
                    </div>


                    <Button
                        onClick={
                            //paraCek
                            () => setShowModal(!showModal)
                        }
                        className="btn  max-w-xs w-full btn-primary bg-[#553DF0] hover:bg-[#553DF0] text-white font-bold py-2 px-4 rounded-md"
                        disabled={!emailVerified}
                    >
                            Send
                    </Button>

                </div>

                <h1 className='mt-5 font-bold italic text-2xl'>Lists</h1>

                <div style={{ width: "100%", height: 600, color: "white" }}>

                {rows && (
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
                        <Button color='error' onClick={deleteRequest}>Delete</Button>
                        <Button color='error' onClick={requestRejected}>Reject</Button>
                        <Button onClick={handleClose}>Close</Button>
                        <Button color='success' onClick={requestAccepted}>Save</Button>
                    </DialogActions>
                </Dialog>
            )}





            <ModalAlert
              
              show={showModal}
              onClose={() => setShowModal(false)}
                
            >

            <div className="w-full flex flex-col items-center justify-center gap-1 ">


            <div className="w-full  rounded-lg flex flex-col items-center justify-center p-4 gap-5 py-0">



                <h3 className="mt-5 text-red-600">NOTICE</h3>

                <div className="text-sm">
                    <div className='text-white'>
                    Requested MAM withdrawal is processed sequentially once a week.
                    </div>

                    <br></br>

                    <div className="text-yellow-400 text-left">
                    (Platform Withdrawal fee Policy 
                    </div>
                    <div className="text-yellow-400 text-right">
                    = Charged a fee)
                    </div>

                </div>

                <div className='flex flex-row items-center font-white'>
                    <input
                        type="checkbox"
                        //defaultChecked={selectedUser?.gonderildi}
                        id='isPay'
                        className="checkbox checkbox-primary"
                        onChange={(e:any) => onCheck(e)}
                        />
                    <p className="pl-3 text-sm text-white">I Agree with the Policy</p>
                </div>

                <button
                    //disabled={isDisabled}
                    onClick={() => {
                        if (isDisabled) {
                            setErrMsgSnackbar("Please check the box to continue");
                            setErr(true);

                        } else {
                            setShowModal(false);
                            paraCek();
                        }
                    }}
                    className="btn btn-success max-w-xs w-full text-xl bg-color-#66CDAA hover:bg-color-#66CDAA  text-white font-bold py-2 px-4 rounded-md"
                >
                WITHDRAW
                </button>
                <button
                    onClick={() => {


                        setShowModal(false);

                        
                    }}
                    className="btn btn-success max-w-xs w-full text-xl bg-color-#66CDAA hover:bg-color-#66CDAA  text-white font-bold py-2 px-4 rounded-md"
                >
                CANCEL
                </button>


                </div>



            </div>

            </ModalAlert>




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
