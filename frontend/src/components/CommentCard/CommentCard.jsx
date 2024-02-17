import React from 'react'
import "./CommentCard.css"
import { Link } from 'react-router-dom'
import { Button, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCommentOnPost } from '../../Actions/Post'
import { getFollowingPosts, getMyPosts } from '../../Actions/User'

const CommentCard = ({
    userId,
    name,
    avatar,
    comment,
    commentId,
    postId,
    isAccount,
  }) => {

    const {user} = useSelector((state)=>state.user);
    const dispatch = useDispatch();

    const deleteCommentHandle = (e)=>{
        e.preventDefault();
        dispatch(deleteCommentOnPost(postId,commentId))

        if(isAccount){
            // console.log(`bring me my posts`);
            dispatch(getMyPosts())
        }else{
            dispatch(getFollowingPosts());
        }
    }
  return (
    <div className='commentUser'>
        <Link to={`/user/${userId}`}>
            <img src={avatar} alt={name} />
            <Typography style={{minWidth:"6vmax"}}>{name}</Typography>
            <Typography style={{marginLeft:'2vmax'}}>{comment}</Typography>
        </Link>

        {
            isAccount?
                (<Button onClick={deleteCommentHandle}><Delete/></Button>):
                userId === user._id?(
                    <Button onClick={deleteCommentHandle}><Delete/></Button>
                ):null
        }     

    </div>
  )
}

export default CommentCard