import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';
import React, { useContext } from 'react'
import { UserContext } from './App';
import logo from '../assets/icon-left-font-monochrome-white.svg'
import { Link } from 'react-router-dom';

function Banner() {
    const user = useContext(UserContext);

    const handleLogOut = (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = '/';
    }

    const buttons = user.token ?
            <>
                <Button color="inherit" onClick={handleLogOut}>LOG OUT</Button>
                <Button component={Link} to='/newPost' color="inherit">NEW POST</Button>
            </>
        : 
            <>
                <Button component={Link} to='/login' color="inherit">LOG IN</Button>
                <Button component={Link} to='/signup' color="inherit">SIGN UP</Button>
            </>

    const bannerBox =
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <Link to='/'>
                            <Box
                                component="img"
                                src={logo}
                                alt='Groupomania'
                                sx={{ maxWidth: 200 }}
                            />
                        </Link>
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}/>
                    { buttons }
                </Toolbar>
            </AppBar>
        </Box>

    return bannerBox
}

export default Banner