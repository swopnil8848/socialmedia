import React, { useEffect, useState } from 'react'
import "./Post.css"
import {
    MoreVert,
    Favorite,
    FavoriteBorder,
    ChatBubbleOutline,
    DeleteOutline,
    Delete,
    AddComment,
} from "@mui/icons-material";
import {useDispatch, useSelector} from 'react-redux'
import { Avatar, Button, Typography,Dialog } from '@mui/material'
import { Link } from 'react-router-dom'
import { addCommentOnPost, likePost, updatePost,deletePost } from '../../Actions/Post';
import { CLEAR_ERRORS, CLEAR_MESSAGE } from '../../Constants/PostConstants';
import { getFollowingPosts, getMyPosts, loadUser } from '../../Actions/User';
import User from '../User/User';
import CommentCard from '../CommentCard/CommentCard';

const Post = ({postId,caption,postImage,likes=[],comments=[],ownerImage,ownerName,ownerId,isDelete=false,isAccount=false}) => {

    const [liked,setLiked] = useState(false)
    const [likesUser,setLikesUser] = useState(false);
    const [commentValue,setCommentValue] = useState("")
    const [commentToggle,setCommentToggle] = useState(false)
    const [captionValue,setCaptionValue] = useState(caption)
    const [captionToggle,setCaptionToggle] = useState(false)

    const dispatch = useDispatch()
    const {user} = useSelector(state=>state.user)

    const handleLike =async () =>{
        setLiked(!liked);

        await dispatch(likePost(postId))

        if(isAccount){
            dispatch(getMyPosts())
        }else{
            dispatch(getFollowingPosts());
        }
    }

    const addCommentHandler =async (e)=>{
        e.preventDefault();

        await dispatch(addCommentOnPost(postId,commentValue))

        if(isAccount){
            dispatch(getMyPosts())
        }else{
            dispatch(getFollowingPosts());
        }
    }

    const updateCaptionHandler = async (e) =>{
        e.preventDefault();
        await dispatch(updatePost(captionValue,postId))
        dispatch(getMyPosts());
    }

    const deletePostHandler = async (e) =>{
        e.preventDefault();
        await dispatch(deletePost(postId))
        dispatch(getMyPosts());
        dispatch(loadUser());
    }

    useEffect(()=>{
        likes.forEach(item=>{
            if(item._id===user._id){
                setLiked(true);
            }
        })
    },[likes,user._id])

  return (
    <div className='post'>
        
        <div className="postHeader">
            {isAccount?
                <Button onClick={()=>setCaptionToggle(!captionToggle)}>
                    <MoreVert/>
                </Button>
                :null
            }
        </div>

        <img src = {postImage} alt = 'Post'/>
        <div className='postDetails'>
            <Avatar src = {ownerImage} alt='User' sx={{
                height : '3vmax',
                width : '3vmax'
            }}/>
            <Link to={`/user/${ownerId}`}>
                <Typography fontWeight={700}>{ownerName}</Typography>
            </Link>
            <Typography
                fontWeight={100}
                color='rgba(0,0,0,0.582)'
                style={{alignSelf:'center'}}
            >
                {caption}
            </Typography>
        </div>
        <button style=
            {{
                border:"none",
                backgroundColor:"white",
                cursor:"pointer",
                margin:"1vmax 2vmax"
            }}  
            onClick={()=>setLikesUser(!likesUser)}
            disabled={likes.length===0?true:false}
        >
            <Typography>{likes.length} Likes</Typography>
        </button>

        <div className="postFooter">
            <Button onClick={handleLike}>
                {liked?<Favorite style={{color:'red'}}/>:<FavoriteBorder/>}
            </Button>
            
            <Button onClick={()=>setCommentToggle(!commentToggle)}>
                <ChatBubbleOutline/>
            </Button>

            {isDelete?(
                <Button onClick={deletePostHandler}>
                    <Delete/>
                </Button>)
                :null
            }
        </div>
        <Dialog open={likesUser} onClose={()=>setLikesUser(!likesUser)}>
            <div className='DialogBox'>
                <Typography variant='h4'>Liked By</Typography>
                {
                    likes.map(like=>(
                        <User
                            key={like._id}
                            userId={like._id}
                            name={like.name}
                            avatar={like.avatar.url}
                        />
                    ))
                }
            </div>
        </Dialog>


        <Dialog open={commentToggle} onClose={()=>setCommentToggle(!commentToggle)}>
            <div className='DialogBox'>
                <Typography variant='h4'>comments</Typography>

                <form className="commentForm" onSubmit={addCommentHandler}>

                    <input
                        type="text" 
                        value={commentValue} 
                        onChange={(e)=>setCommentValue(e.target.value)} 
                        placeholder='coment here../' required
                    />
                    <Button type='submit' variant='contained'>
                        Add
                    </Button>
                </form>

                {
                    comments.length>=0 ? comments.map((item)=>(
                        <CommentCard
                            key={item._id}
                            userId={item.user._id}
                            name={item.user.name}
                            avatar={item.user.avatar.url}
                            comment={item.comment}
                            commentId={item._id}
                            postId={postId}
                            isAccount={isAccount}
                        />
                    )): <Typography>No Comments Yet</Typography>
                }
            </div>
        </Dialog>

        <Dialog open={captionToggle} onClose={()=>setCaptionToggle(!captionToggle)}>
            <div className='DialogBox'>
                <Typography variant='h4'>update captopn</Typography>

                <form className="commentForm" onSubmit={updateCaptionHandler}>

                    <input
                        type="text" 
                        value={captionValue} 
                        onChange={(e)=>setCaptionValue(e.target.value)} 
                        placeholder='caption here..' required
                    />
                    <Button type='submit' variant='contained'>
                        Update
                    </Button>
                </form>

            </div>
        </Dialog>
    </div>
  )
}

export default Post