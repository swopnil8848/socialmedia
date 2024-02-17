import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {deleteME, getMyPosts, logoutUser} from '../../Actions/User'
import "./Account.css"
import Loader from '../Loader/Loader'
import { Avatar, Button, Dialog, Typography } from '@mui/material'
import Post from '../Post/Post'
import { CLEAR_ERRORS } from '../../Constants/UserConstants'
import { CLEAR_MESSAGE } from '../../Constants/PostConstants'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import User from '../User/User'

const Account = () => {
    const dispatch = useDispatch()
    const alert = useAlert();


    const {user,loading:userLoading} = useSelector((state)=>state.user)
    const {loading,error,posts} = useSelector((state)=>state.myPosts)
    const {error:likeError,message} = useSelector((state)=>state.like);
    const {loading:deleteLoading} = useSelector((state)=>state.updateUser)

    const [followersToggle,setFollowersToggle] = useState(false)
    const [followingToggle,setFollowingToggle] = useState(false)

    const logoutHandler = ()=>{
        dispatch(logoutUser());
        alert.success("logged out successfully")
    }

    const deleteProfileHandler =async () =>{
        await dispatch(deleteME());
        dispatch(logoutUser());

    }

    useEffect(()=>{
        dispatch(getMyPosts())
    },[dispatch])

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch({type:CLEAR_ERRORS})
        }
        if(likeError){
          alert.error(likeError);
          dispatch({type:CLEAR_ERRORS})
        }
        if(message){
            alert.success(message);
            dispatch({type:CLEAR_MESSAGE})
        }
    },[alert,error,message,likeError,dispatch])


  return (

    loading===true && userLoading===true?(<Loader/>):(
        <div className='account'>
            <div className="accountleft">
                {
                    posts && posts.length > 0? posts.map(post=>(
                        <Post
                            key={post._id}
                            postId = {post._id}
                            caption={post.caption}
                            postImage={post.image.url}
                            likes={post.likes}
                            comments = {post.comments}
                            ownerName={post.owner.name}
                            ownerId={post.owner._id}
                            isAccount={true}
                            isDelete={true}
                        />
                    )):<Typography variant='h6'>No posts to show</Typography>
                }
            </div>
            <div className="accountright">
                <Avatar src={user.avatar.url} sx={{height:"8vmax",width:"8vmax"}}/>
                <Typography variant='h6'>{user.name}</Typography>
                <div>
                    <button onClick={()=>setFollowersToggle(!followersToggle)}>
                        <Typography>Followers</Typography>
                    </button>
                    <Typography>{user.followers?.length}</Typography>
                </div>

                <div>
                    <button onClick={()=>setFollowingToggle(!followingToggle)}>
                        <Typography>Following</Typography>
                    </button>
                    <Typography>{user.following.length}</Typography>
                </div>

                <div>
                    <Typography>Post</Typography>
                    <Typography>{user.posts.length}</Typography>
                </div>

                <Button variant ="contained" onClick={logoutHandler}>Logout</Button>

                <Link to='/update/profile'>Edit Profile</Link>
                <Link to='/update/password'>Edit Password</Link>

                <Button onClick={deleteProfileHandler} disabled={deleteLoading} variant='text' style={{color:'red' , margin:'2vmax'}}>
                    Delete My Profile
                </Button>

                <Dialog open={followersToggle} onClose={()=>setFollowersToggle(!followersToggle)}>
                    <div className='DialogBox'>
                        <Typography variant='h4'>Followers</Typography>
                        {
                            user && user.followers.length>0 ? (user.followers.map((follower)=>(
                                <User
                                    key={follower._id}
                                    userId={follower._id}
                                    name={follower.name}
                                    avatar={follower.avatar.url}
                                />
                            ))):(<Typography>you have no followers</Typography>)
                        }
                    </div>
                </Dialog>

                <Dialog open={followingToggle} onClose={()=>setFollowingToggle(!followingToggle)}>
                    <div className='DialogBox'>
                        <Typography variant='h4'>Following</Typography>
                        {
                            user && user?.following.length>0 ? (user?.following.map((following)=>(
                                <User
                                    key={following._id}
                                    userId={following._id}
                                    name={following.name}
                                    avatar={following.avatar.url}
                                />
                            ))):(<Typography>you are not following anyone</Typography>)
                        }
                    </div>
                </Dialog>
            </div>
        </div>
    )
  )
}

export default Account