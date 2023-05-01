'use client';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Button, Drawer, Tooltip } from '@mui/material';
import React, { useState } from 'react'
import { BsChatLeftFill } from 'react-icons/bs';

type Anchor = 'left'
export default function Chat() {
    const [demo, setDemo] = useState(false)
    const [state, setState] = useState({
        left: false,
    });

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: 250, backgroundColor: '#1f2029', height: '100vh', justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}
            role="presentation"
        // onClick={toggleDrawer(anchor, false)}
        // onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>

                        </ListItemIcon>
                        <ListItemText className='text-white' primary={'Chat Room'} />
                    </ListItemButton>
                </ListItem>

            </List>
            <List className='h-full'>
                <div className='flex flex-col w-full h-full p-1 text-gray-200 gap-1'>
                    <p>User1: Lorem Ipsum!</p>
                    <p>User2: Lorem Ipsum!</p>
                    <p>User3: Lorem Ipsum!</p>
                    <p>User4: Lorem Ipsum!</p>
                    <p>User5: Lorem Ipsum!</p>
                    <p>User6: Lorem Ipsum!</p>
                    <p>User7: Lorem Ipsum!</p>
                    <p>User8: Lorem Ipsum!</p>
                    <p>User9: Lorem Ipsum!</p>
                    <p>User10: Lorem Ipsum!</p>
                    <p>User11: Lorem Ipsum!</p>
                    <p>User12: Lorem Ipsum!</p>
                </div>
            </List>
            <List  >
                <div className=' w-full  flex items-center justify-between relative'>
                    <input type="text" className='input w-full input-sm' disabled />
                    <Tooltip title="DEMO" arrow>
                        <button className='btn btn-sm h-full btn-primary'>Send</button>
                    </Tooltip>
                </div>
            </List>
        </Box>
    );


    return (
        <div>
            <div>
                <React.Fragment >
                    <Button onClick={toggleDrawer('left', true)} className='fixed left-2 top-[85%] z-50'> <BsChatLeftFill className='w-8 h-8 fill-gray-400' /> </Button>
                    <Drawer
                        anchor='left'
                        open={state['left']}
                        onClose={toggleDrawer('left', false)}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        {list('left')}
                    </Drawer>
                </React.Fragment>
            </div>
        </div>
    )
}
