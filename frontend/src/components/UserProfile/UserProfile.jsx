import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {deleteME, followAndUnfollowUser, getMyPosts, getuserProfile, logoutUser} from '../../Actions/User'
import Loader from '../Loader/Loader'
import { Avatar, Button, Dialog, Typography } from '@mui/material'
import Post from '../Post/Post'
import { CLEAR_ERRORS } from '../../Constants/UserConstants'
import { CLEAR_MESSAGE } from '../../Constants/PostConstants'
import { Link, useParams } from 'react-router-dom'
import { useAlert } from 'react-alert'
import User from '../User/User'
import { getuserPosts } from '../../Actions/Post'

const UserProfile = () => {
    const dispatch = useDispatch()
    const alert = useAlert();
    const params = useParams();

    const {user:me}=useSelector((state=>state.user))
    const {user,loading:userLoading,error:userError} = useSelector((state)=>state.userProfile)
    const {loading,error,posts} = useSelector((state)=>state.userPosts)
    const {error:likeError,message} = useSelector((state)=>state.like);
    const {loading:followLoading,error:followError} = useSelector((state)=>state.updateUser)

    const [followersToggle,setFollowersToggle] = useState(false)
    const [followingToggle,setFollowingToggle] = useState(false)
    const [following,setFollowing] = useState(false);
    const [myProfile,setMyProfile] = useState(false);

    const followHandler =async ()=>{
        setFollowing(!following);

        await dispatch(followAndUnfollowUser(user._id));
        dispatch(getuserProfile(params.id));
    }

    useEffect(()=>{
        dispatch(getuserPosts(params.id))
        dispatch(getuserProfile(params.id))

        console.log(posts)
        
        if(me?._id===params.id){
            setMyProfile(true);
        }

        
    },[dispatch,params.id,me._id])

    // i have used this useEffect seperately cause i want this to run after the page reload and the user and me updates.
    //  i couldnt use it above it up cause it would dispath the function for me and user again causing some problems
    useEffect(()=>{
        if(user && me){
            user.followers.forEach((item)=>{
                if(item?._id === me._id){
                    setFollowing(true);
                }else{
                    setFollowing(false)
                }
            })
        }
    },[user,me])

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch({type:CLEAR_ERRORS})
        }
        if(likeError){
          alert.error(followError);
          dispatch({type:CLEAR_ERRORS})
        }
        if(followError){
          alert.error(followError);
          dispatch({type:CLEAR_ERRORS})
        }
        if(userError){
          alert.error(userError);
          dispatch({type:CLEAR_ERRORS})
        }
        if(message){
            alert.success(message);
            dispatch({type:CLEAR_MESSAGE})
        }
    },[alert,error,message,likeError,userError, dispatch,followError])


  return (

    loading===true && userLoading===true?(<Loader/>):(
        <div className='account'>
            <div className="accountleft">
                {
                    posts && posts.length > 0? posts?.map(post=>(
                        <Post
                            key={post._id}
                            postId = {post._id}
                            caption={post.caption}
                            postImage={post.image.url}
                            likes={post.likes}
                            comments = {post.comments}
                            ownerName={post.owner.name}
                            ownerId={post.owner._id}
                        />
                    )):<Typography variant='h6'>user has not made any posts</Typography>
                }
            </div>
            <div className="accountright">
                {
                    user && (
                        <>
                            <Avatar src={user?.avatar.url} sx={{height:"8vmax",width:"8vmax"}}/>
                            <Typography variant='h6'>{user?.name}</Typography>
                            <div>
                                <button onClick={()=>setFollowersToggle(!followersToggle)}>
                                    <Typography>Followers</Typography>
                                </button>
                                <Typography>{user?.followers?.length}</Typography>
                            </div>

                            <div>
                                <button onClick={()=>setFollowingToggle(!followingToggle)}>
                                    <Typography>Following</Typography>
                                </button>
                                <Typography>{user?.following.length}</Typography>
                            </div>

                            <div>
                                <Typography>Post</Typography>
                                <Typography>{user?.posts.length}</Typography>
                            </div>

                            {
                                myProfile ? null:(
                                    <Button variant ="contained" onClick={followHandler} disabled={followLoading}>
                                        {following?"Unfollow":"Follow"}
                                    </Button>
                                )
                            }
                        </>
                    )
                }
                
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

export default UserProfile