import { Button, IconButton, TextField, Card, Box } from "@mui/material";
import React, { useContext, useState } from "react";
import { UserContext } from "./App";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CardMedia from '@mui/material/CardMedia';

function EditPost ({ post, setEditable }) {

    const user = useContext(UserContext);

    const defaultValues = {
        content: post.content,
    }
    const [formValues, setFormValues] = useState(defaultValues)
    const [image, setImage] = useState()

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
          ...formValues,
          [name]: value,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();

        let postCopy = {...post}
        postCopy.content = formValues.content
        formData.append('post', JSON.stringify(postCopy))
        if (image) {
            formData.append('file', image)
        }
        fetch(`http://localhost:4200/api/post/${post._id}`, {
            method: 'PUT',
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
                setEditable({id: null, isEditable: false})
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
                width: 1
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1, width: 1, minWidth: 350 }}
            >
                <Box
                    component={Card}
                    sx={{ flexGrow: 1, width: 1 }}
                    variant='outlined'
                >
                    { (post.imageUrl && !image) &&
                        <CardMedia
                            alt={post.imageUrl}
                            component="img"
                            image={post.imageUrl}
                            sx={{
                                objectFit: 'scale-down',
                                maxHeight: 300
                            }}
                            />
                    }
                    { image &&
                        <CardMedia
                            alt={image.name}
                            component="img"
                            image={URL.createObjectURL(image)}
                            sx={{
                                objectFit: 'scale-down',
                                maxHeight: 300
                            }}
                            />
                    }
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                    >
                        <input hidden accept="image/*" type="file" onChange={handleAddImages} />
                        <AddPhotoAlternateIcon color="inherit"/>
                    </IconButton>
                    <Box component={TextField}
                        margin="normal"
                        required
                        fullWidth
                        multiline
                        id="content"
                        label="Post content"
                        name="content"
                        autoComplete="content"
                        defaultValue={post.content}
                        autoFocus
                        value={formValues.name}
                        onChange={handleInputChange}
                        variant="standard"
                        sx={{ width: 0.98, mr: 1, ml: 1 }}
                    />
                    <Button type="submit">EDIT POST</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default EditPost