import React, { useEffect } from 'react'
import './Home.css'
import User from '../User/User'
import Post from '../Post/Post'
import {useDispatch, useSelector} from 'react-redux'
import { getAllUsers, getFollowingPosts } from '../../Actions/User'
import Loader from '../Loader/Loader'
import { Typography } from '@mui/material'
import { CLEAR_ERRORS, CLEAR_MESSAGE } from '../../Constants/PostConstants'
import { useAlert } from 'react-alert';

const Home = () => {

  const dispatch  = useDispatch();
  const alert = useAlert();


  const {loading,posts,error} = useSelector(state=>state.postOfFollowing)

  const {users,loading:usersLoading} = useSelector(state=>state.allUsers);

  const {error:likeError,message} = useSelector((state)=>state.like);


  useEffect(()=>{
    dispatch(getFollowingPosts());
    dispatch(getAllUsers());
  },[dispatch]);



  useEffect(()=>{
    if(error){
        alert.error(message);
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
},[alert,error,message])

  return (
    loading===true || usersLoading === true?<Loader/>:(
      <div className='home'>
          <div className='homeleft'>
              {
                posts && posts.length>0 ? posts.map((post)=>(
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
                )):<Typography variant='h6'>No posts yet</Typography>
              }
          </div>
          <div className='homeright'>
              {
                users && users.length > 0 ? users.map((user)=>((
                  <User
                    key={user._id}
                    userId={user._id}
                    name={user.name}
                    avatar={user.avatar.url}
                  />
                ))):<Typography>No Users Yet</Typography>
              }
          </div>
      </div>
    )
  )
}

export default Home