import React, { useEffect, useState } from 'react'
import './updateProfile.css'
import { Avatar, Button, Typography } from '@mui/material'
import {useDispatch, useSelector} from 'react-redux'
import { loadUser, registerUser, updateUserProfile } from '../../Actions/User'
import { useAlert } from 'react-alert'
import { CLEAR_ERRORS } from '../../Constants/UserConstants'
import Loader from '../Loader/Loader'
import { Link } from 'react-router-dom'
import { CLEAR_MESSAGE } from '../../Constants/PostConstants'


const UpdateProfile = () => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const {loading,error,user} = useSelector(state=>state.user)
  const {loading:updateLoading,error:updateError,message} = useSelector(state=>state.updateUser)
  const [name,setName] = useState(user.name)
  const [email,setEmail] = useState(user.email)
  const [avatar,setAvatar] = useState()
  const [avatarPrev,setAvatarPrev] = useState(user.avatar.url);

  const submitHandler =async (e)=>{
    e.preventDefault();
    await dispatch(updateUserProfile(name,email,avatar));
    dispatch(loadUser());
  }

  const handleImageChange = (e) =>{
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () =>{
        if(Reader.readyState==2){
            // console.log(Reader.result)
            setAvatarPrev(Reader.result);

            setAvatar(Reader.result);
        }
    }
  }

  useEffect(()=>{
    console.log("user updated message",message)
    if(error){
      alert.error(error);
      dispatch({type:CLEAR_ERRORS})
    }
    if(updateError){
        alert.error(updateError);
        dispatch({type:CLEAR_ERRORS})
    }
    if(message){
        console.log('inside the if ',message)
        alert.success(message);
        dispatch({type:CLEAR_MESSAGE})
    }

  },[dispatch,error,alert,updateError,message]);

  return (
    loading?<Loader/>:(
    <div className='updateProfile'>
        <form className="updateProfileForm" onSubmit={submitHandler}>
        <Typography variant='h3' style={{padding:"2vmax"}}>Social App</Typography>

        <Avatar src={avatarPrev} alt='user' sx={{height:'10vmax',width:'10vmax'}}/>
        <input type="file" accept='image/*' onChange={handleImageChange}/>
        <input className='updateProfileInputs' type="text" placeholder='Name' value={name} required onChange={(e)=>setName(e.target.value)}/>
        <input className='updateProfileInputs' type="email" placeholder='Email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>

        <Button disabled={updateLoading} type="submit">Update</Button>

        </form>
    </div>)
  )
}

export default UpdateProfile