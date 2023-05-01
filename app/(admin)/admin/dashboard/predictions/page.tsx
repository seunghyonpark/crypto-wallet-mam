'use client';
import { Slide, Chip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridColDef, GridApi, GridCellValue, DataGrid } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { IUser } from "@/libs/interface/user";

import ModalAlert from '@/components/ModalAlert';
import { useTransferToken } from '@thirdweb-dev/react';



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function PredictionList() {



  const [predictions, setPredictions] = useState<any>([]);


  const [open, setOpen] = React.useState(false);

  const [selectedUser, setSelectedUser] = useState<any>();

  const [userAdmin, setUserAdmin] = useState<any>();

  ///const [showModal, setShowModal] = useState(false);



  const [user, setUser] = useState<IUser>();


  const [username, setUsername] = useState<string>('');
  


  const getUser = async () => {
    const inputs = {
        method: 'getOne',
        API_KEY: process.env.API_KEY,
        userToken: getCookie('admin')
    }
    const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
    })
    const user = await res.json()
    setUser(user.user.user)

    console.log(user.user.user);

  }

  useEffect(() => {

    getUser();

  }, []);



/*
  date: {
    type: Date,
    default: Date.now,
  },
  userToken: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  selectedSide: {
    type: String,
    required: true,
  },
  closePrice: {
    type: Number,
    required: true,
  },
  winnerHorse: {
    type: String,
    required: true,
  },
  placements: {
    type: Array,
    line: {
      type: Number,
      required: true,
    },
    horse: {
      type: String,
      required: true,
    },
  },

  prizeAmount: {
    type: Number,
    required: true,
  },
  resultAmount: {
    type: Number,
    required: true,
  },
  prizeFee: {
    type: Number,
    required: false,
  },
  depositBefore: {
    type: Number,
    required: true,
  },
  depositAfter: {
    type: Number,
    required: true,
  },
*/



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
      field: "date",
      headerName: "DATE",
      align: "center",
      headerAlign: "center",
      width: 150,
      type: "dateTime",
      minWidth: 250,
      valueFormatter: (params) => {
          return new Date(params.value).toLocaleString();
      }, // burada tarih formatı değiştirilebilir.
    },
    {
      field: "username",
      headerName: "Nick Name",
      flex: 0.2,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "betAmount",
      headerName: "betAmount",
      flex: 0.1,
      minWidth: 120,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params) => {
        return new Number(params.value).toFixed(2);
      } ,
    },
    {
      field: "selectedSide",
      headerName: "SELECT",
      flex: 0.2,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "basePrice",
      headerName: "ENTRY",
      flex: 0.1,
      minWidth: 120,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params) => {
        return new Number(params.value).toFixed(2);
      } ,
    },
    {
      field: "closePrice",
      headerName: "LAST",
      flex: 0.1,
      minWidth: 120,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params) => {
        return new Number(params.value).toFixed(2);
      } ,
    },
    {
      field: "winnerHorse",
      headerName: "END",
      flex: 0.2,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "prizeFee",
      headerName: "FEE",
      flex: 0.1,
      minWidth: 120,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params) => {
        return new Number(params.value).toFixed(2);
      } ,
    },
    {
      field: "resultAmount",
      headerName: "RESULT",
      flex: 0.1,
      minWidth: 120,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params) => {
        return new Number(params.value).toFixed(2);
      } ,
    },

  ];



  const search = async () => {
    if (!username) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a username!',
      });
      return;
    }


    const res = await fetch('/api/bethistory', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: "getAllforUsername",
        API_KEY: process.env.API_KEY,
        username: username,
      }),
    })
    const data = await res.json();

    setPredictions(data?.betHistory);
  }



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


  
  useEffect(() => {

    const getAll = async () => {

      const res = await fetch('/api/bethistory', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: "getAll",
          API_KEY: process.env.API_KEY,
        }),
      })
      const data = await res.json();
  
      setPredictions(data?.betHistory);

    }

    getAll();

  }, []);


  const [betSum, setBetSum] = React.useState(0)
  const [prizeSum, setPrizeSum] = React.useState(0)

  const getAllBetSum = async () => {

      const res = await fetch('/api/bethistory', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              method: "getAllBetAmount",
              API_KEY: process.env.API_KEY,
          }),
      })
      const data = await res.json()

      ///console.log(data)

      setBetSum(data.sum)
      
      //if (data.payments.length == 0) return setRequests(0)
      //setRequests(data.payments.length)
  }

  const getAllPrizeSum = async () => {
    const res = await fetch('/api/bethistory', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            method: "getAllPrizeAmount",
            API_KEY: process.env.API_KEY,
        }),
    })
    const data = await res.json()

    setPrizeSum(data.sum)
    
    //if (data.payments.length == 0) return setRequests(0)
    //setRequests(data.payments.length)
}

  React.useEffect(() => {
      getAllBetSum()
      getAllPrizeSum()
  }, [])
  


  /*
  const getAll = async () => {
    const res = await fetch('/api/user', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: "getAll",
        API_KEY: process.env.API_KEY,
      }),
    })
    const data = await res.json()
    setUsers(data?.users?.users)
  }
  */




  const updateUser = async () => {
    //let username = (document.getElementById("username") as HTMLInputElement).value
    //let email = (document.getElementById("email") as HTMLInputElement).value
    //let walletAddress = (document.getElementById("walletAddress") as HTMLInputElement).value
    //let coinBalance = (document.getElementById("coinBalance") as HTMLInputElement).value
    //let maticBalance = (document.getElementById("maticBalance") as HTMLInputElement).value
    let admin = (document.getElementById("admin") as HTMLInputElement).checked

    const formInputs = {
      method: "update",
      API_KEY: process.env.API_KEY,

      userToken: selectedUser?.userToken,

      //username: username,
      //email: email,
      //walletAddress: walletAddress,
      ////deposit: coinBalance,
      ////maticBalance: maticBalance,
      admin: admin,
      //pass1: selectedUser.pass1,
      //pass2: selectedUser.pass2,
      //img: selectedUser.img,
    }

    handleClose();

    Swal.fire({
      title: 'Do you want to saved changes?',
      confirmButtonText: 'Save',
      showCloseButton: true,
      showCancelButton: true,
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/api/user', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formInputs),
        })
          .then(res => res.json())
          .then(data => {
            if (data.user.success) {
              Swal.fire('Saved!', '', 'success')
              ///getAll()
            } else {
              Swal.fire('Error!', '', 'error')
            }
          })
      } else if (result.isDismissed) {
        // do something
      }
    })
  }


  

  const deleteUser = async () => {
    handleClose()

    if (selectedUser.coin > 0) {
      Swal.fire({
        title: 'User has balance!',
        ////confirmButtonText: 'Delete!',
        showCloseButton: true,
        showCancelButton: false,
        icon: 'warning',
      }).then((result) => {
        /*
        if (result.isConfirmed) {
          const formInputs = {
            method: "delete",
            API_KEY: process.env.API_KEY,
            userToken: selectedUser.userToken,
          }
          fetch('/api/user', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formInputs),
          }).then(res => res.json()).then(data => {
            if (data.status) {
              Swal.fire('Deleted!', '', 'success')
              getAll();
            } else {
              Swal.fire('Error!', '', 'error')
              getAll();
            }
          })
          
        } else if (result.isDismissed) {
          // do something
        }
        */

      })

    } else {

      Swal.fire({
        title: 'Do you want to delete user?',
        confirmButtonText: 'Delete!',
        showCloseButton: true,
        showCancelButton: true,
        icon: 'warning',
      }).then((result) => {
        if (result.isConfirmed) {
          const formInputs = {
            method: "delete",
            API_KEY: process.env.API_KEY,
            userToken: selectedUser.userToken,
          }
          fetch('/api/user', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formInputs),
          }).then(res => res.json()).then(data => {
            if (data.status) {
              Swal.fire('Deleted!', '', 'success')
              ///getAll();
            } else {
              Swal.fire('Error!', '', 'error')
              ///getAll();
            }
          })
        } else if (result.isDismissed) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })

    }

  }


  const rows = predictions?.map((item: any, i: number) => {

    return {
      kayitId: item._id,
      id: i + 1,
      date: item.date,
      userToken: item.userToken,
      username: item.username,
      betAmount: item.betAmount,
      basePrice: item.basePrice,
      closePrice: item.closePrice,
      selectedSide: item.selectedSide,
      winnerHorse: item.winnerHorse,
      prizeFee: item.prizeFee,
      resultAmount: item.resultAmount - item.prizeFee,

    }

  })
  


  return (
    <>


        <div className='flex flex-col p-10 mt-5 text-gray-200'>
          <h1 className='font-bold italic text-2xl'>Bet History</h1>

{/*
          <h1 className='font-bold italic text-2xl'>Total Bet Amount: {Number(betSum).toFixed(2)}</h1>
          <h1 className='font-bold italic text-2xl'>Total Prize Amount: {Number(prizeSum/2).toFixed(2)}</h1>
*/}

          <div className='flex flex-row  justify-left mt-5 mb-5'>
            <input
                placeholder="Nick Name"
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
                className="input input-bordered w-full max-w-xs text-white"
            />

            <button
                onClick={() => {
                    //user?.deposit && user?.deposit > 10000 ? setMiktar("10000") : setMiktar(user?.deposit)

                    search();
                }}
                className='btn btn-xs h-12 ml-2 text-yellow-500 border-yellow-500 hover:bg-white bg-white '
            >
                Search
            </button>
          </div>


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

              }}
              
            />
          )}


          </div>
        </div>


{/*
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
        */}


            
        {selectedUser && (
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle> User Edit Form  </DialogTitle>

            <DialogContent className='space-y-3'>

            {user?.admin && user?.adminLevel === 0 && (

              <div className='flex gap-1 items-center'>
                <input
                  type="checkbox"
                  defaultChecked={selectedUser?.admin}
                  id='admin'
                  className="checkbox checkbox-primary"
                />
                <p>Admin?</p>
              </div>
            )}

              <DialogContentText>
                ID(E-mail): <span className='font-bold italic'> {selectedUser?.email} </span>
              </DialogContentText>

              <DialogContentText>
                Nick Name: <span className='font-bold italic'> {selectedUser?.username} </span>
              </DialogContentText>

              <DialogContentText>
                Balance (CRA): <span className='font-bold italic'> {selectedUser?.coin} </span>
              </DialogContentText>

              <DialogContentText>
                Deposit Address: <span className='font-bold italic'> {selectedUser?.walletAddress} </span>
              </DialogContentText>



            </DialogContent>




            <DialogActions>

            {user?.admin && user?.adminLevel === 1 && (
              <Button onClick={deleteUser}>DELETE</Button>
            )}

              <Button onClick={handleClose}>Close</Button>
              <Button color='success' onClick={updateUser}>Save</Button>
            </DialogActions>
          </Dialog>
        )}

        



    </>
  )
}
