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

import { VscGear, VscCheck } from "react-icons/vsc";


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function UserList() {

  const [users, setUsers] = useState<any>([]);
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
      field: "referralCode",
      headerName: "Referral Code",
      flex: 0.2,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.2,
      minWidth: 300,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const onClick = (e: any) => {
            e.stopPropagation(); // don't select this row after clicking

            /*
            const api: GridApi = params.api;
            const thisRow: Record<string, GridCellValue> = {};

            api
                .getAllColumns()
                .filter((c) => c.field !== "__check__" && !!c)
                .forEach(
                    (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                );

            return duzenle(params.row);
            */
            return;
        };
        return (
          <>
            <span className=" w-80 justify-right">{params.value}</span>
            <div className='flex justify-center items-center '>
              {params.row.emailVerified ?
                <VscCheck className=" w-5 h-5 text-green-500" />
                :
              <Button color="success" variant='contained' className='text-xs bg-green-500' onClick={onClick}>
                  Send Auth
              </Button>
              }
            </div>
          </>
        );
      },
      
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
      field: "referral",
      headerName: "Referral",
      flex: 0.2,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "coin",
      headerName: "Balance (CRA)",
      flex: 0.1,
      minWidth: 120,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params) => {
        return new Number(params.value).toFixed(2);
      } ,
    },
    {
      field: "walletAddress",
      headerName: "Deposit Address",
      flex: 0.2,
      minWidth: 400,
      align: "center",
      headerAlign: "center",
    },


    {
      field: "admin",
      headerName: "Admin",
      align: "center",
      headerAlign: "center",
      type: "number",
      flex: 0.1,
      minWidth: 100,

      renderCell(params) {
        return <Chip label={`${params.value ? "Admin" : "User"}`} color={`${params.value ? "success" : "info"}`} />;
      },
    },
    {
      field: "adminLevel",
      headerName: "Admin Level",
      align: "center",
      headerAlign: "center",
      type: "number",
      flex: 0.1,
      minWidth: 150,

      renderCell(params) {
        return <Chip label={`${params.row.admin === true && params.value === 1 ? "Super Admin" : "NaN"}`} color={`${params.value ? "success" : "info"}`} />;
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





const search = async () => {
  if (!username) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please enter a username!',
    });
    return;
  }


  const res = await fetch('/api/user', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: "getOneByUsername",
      API_KEY: process.env.API_KEY,
      username: username,
    }),
  })
  const data = await res.json();

  console.log("user data", data);

  ////setUser(data?.user?.user);

  if (data?.user?.user) {
    ///setUsers(array(data?.user?.user));
    setUsers([data?.user?.user]);

  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'User not found!',
    });
  }


}



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  
  useEffect(() => {
    getAll()
  }, [])
  

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
              getAll()
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
              getAll();
            } else {
              Swal.fire('Error!', '', 'error')
              getAll();
            }
          })
        } else if (result.isDismissed) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })

    }

  }


  const rows = users.map((item: any, i: number) => {

    return {
      kayitId: item._id,
      id: i + 1,
      email: item.email,
      emailVerified: item.emailVerified,
      img: item.img,
      admin: item.admin,
      adminLevel: item.adminLevel,
      status: item.status,
      walletAddress: item.walletAddress,
      username: item.username,
      referralCode: item.referralCode,
      referral: item.referral,
      //pass1: item.pass1,
      //pass2: item.pass2,
      userToken: item.userToken,
      coin: item.deposit,
      //matic: item.maticBalance,

    }
  })


  return (
    <>
      <>

        <div className='flex flex-col p-10 mt-5 text-gray-200'>
          <h1 className='font-bold italic text-2xl'>Users</h1>

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
               
                /*
                color: "white",
                bgcolor: "gray.800",
                */

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

            {user?.admin && user?.adminLevel === 1 && (

             

              <div className='flex gap-1 items-center'>

                <input
                  type="checkbox"
                  ////defaultChecked={selectedUser?.admin === true ? true : false}
                  defaultChecked={
                    selectedUser?.admin
                  }
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
    </>
  )
}
