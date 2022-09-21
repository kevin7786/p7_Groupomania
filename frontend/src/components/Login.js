import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import { Link } from "react-router-dom";

function LogIn ({ setUser }) {
    const defaultValues = {
        email: "",
        password: ""
    }
    const [formValues, setFormValues] = useState(defaultValues)
    const navigate = useNavigate()

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
          ...formValues,
          [name]: value,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:4200/api/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        })
        .then (res => {
            if (res.ok) {
                return(res.json())
            }
            alert('Invalid user/password pair')
        })
        .then (user => {
            setUser(user);
            if (user) {
                navigate('/')
            }
        })
        .catch (err => {
            if (err) { console.error(err) }
        })
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mr: 1,
                ml: 1
            }}
        >
            <Typography component="h1" variant="h5">
                LOG IN
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formValues.name}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircleIcon />
                            </InputAdornment>
                        ),
                    }}
                    variant="standard"
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <KeyIcon />
                            </InputAdornment>
                        ),
                    }}
                    variant="standard"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    LOG IN
                </Button>
                <Link to='/signup' variant="body2">
                    {"Don't have an account? Sign Up"}
                </Link>
            </Box>
        </Box>
    )
}

LogIn.propTypes = {
    setUser: PropTypes.func.isRequired
}

export default LogIn