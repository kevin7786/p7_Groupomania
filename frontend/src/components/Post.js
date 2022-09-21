import { Box, Button, Card, CardContent } from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import React, { useContext } from 'react';
import { UserContext } from "./App";
import Like from "./Like";

function Post ({ post, setEditable }) {

    const user = useContext(UserContext);
    
    const handleRemovePost = (event) => {
        event.preventDefault();
        fetch(`http://localhost:4200/api/post/${post._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        .then((res) => {
            if (res.ok) {
                return(res.json());
            }
        })
        .then(() => {
            setEditable({id: null, isEditable: false})
        })
        .catch(err => {
            if (err) {
                console.error(err);
            }
        })
    }

    const handleEditPost = (event) => {
        event.preventDefault();
        setEditable({id: post._id, isEditable: true});
    }

    const likeButtons = user.token &&
        <Like post={post} setEditable={setEditable}/>

    const actionButtons = (user.isAdmin || post.userId === user.userId) &&
        <>
            <Button onClick={handleEditPost}>EDIT</Button>
            <Button onClick={handleRemovePost}>REMOVE</Button>
        </>

    const postCard =
        <Box
            component={Card}
            sx={{ flexGrow: 1 }}
            variant='outlined'
        >
            {post.imageUrl && (
                <CardMedia
                    alt={post.imageUrl}
                    component="img"
                    image={post.imageUrl}
                    sx={{
                        objectFit: 'scale-down',
                        maxHeight: 300
                    }}
                />
            )}
            <CardContent>
                {post.content}
            </CardContent>
            <CardActions disableSpacing>
                {likeButtons}
                {actionButtons}
            </CardActions>
        </Box>

    return postCard
    }

export default Post