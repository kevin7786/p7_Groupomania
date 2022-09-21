import { Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./App";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';

function NewPost () {

    const user = useContext(UserContext)
    const defaultValues = {
        content: "",
    }
    const [formValues, setFormValues] = useState(defaultValues)
    const [image, setImage] = useState()

    const formData = new FormData();

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
          ...formValues,
          [name]: value,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        formData.append('content', formValues.content)
        if (image) {
            formData.append('file', image)
        }
        fetch('http://localhost:4200/api/post/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`
            },
            body: formData
        })
        .then (value => {
            return(value.json())
        })
        .then (value => {
            if (value) {
                navigate('/');
            }
        })
        .catch (err => {
            if (err) { console.error(err) }
        })
    }

    const handleAddImages = (event) => {
        setImage(event.target.files[0])
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mr: 1,
                ml: 1,
            }}
        >
            <Typography component="h1" variant="h5">
                NEW POST
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1, width: '75%', minWidth: 350 }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    multiline
                    id="content"
                    label="Post content"
                    name="content"
                    autoComplete="content"
                    autoFocus
                    value={formValues.name}
                    onChange={handleInputChange}
                    variant="standard"
                />
                <IconButton color="primary" aria-label="upload picture" component="label">
                    <input hidden accept="image/*" type="file" onChange={handleAddImages} />
                    <AddPhotoAlternateIcon color="inherit"/>
                </IconButton>
                {image && (
                    <img alt={image.name} width={"250px"} src={URL.createObjectURL(image)} />
                )}            
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    SHARE
                </Button>
            </Box>
        </Box>
    )
}

export default NewPost