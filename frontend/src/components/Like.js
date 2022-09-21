import { Button } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { useContext } from "react";
import { UserContext } from "./App";

function Like ({ post, setEditable }) {
    const user = useContext(UserContext);
    const postAlreadyLiked = post.usersLiked.includes(user.userId);
    const postAlreadyDisliked = post.usersDisliked.includes(user.userId);

    const likeRequest = (value) => {
        fetch(`http://localhost:4200/api/post/${post._id}/like`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ userId: user.userId, like: value })
        })
        .then((res) => {
            if (res.ok) {
                return(res.json())
            }
        })
        .then((res) => {
            setEditable({id: null, isEditable: false})
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const handleLike = (event) => {
        event.preventDefault();
        likeRequest(postAlreadyLiked ? 0 : 1);
    }

    const handleDislike = (event) => {
        event.preventDefault();
        likeRequest(postAlreadyDisliked ? 0 : -1);
    }

    return (
        <>
            <Button onClick={handleLike}>
                { post.likes }
                { postAlreadyLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon /> }
                </Button>
            <Button onClick={handleDislike}>
                { post.dislikes }
                { postAlreadyDisliked ? <ThumbDownIcon /> : <ThumbDownOffAltIcon /> }    
            </Button>
        </>
    )
}

export default Like