import React, { useEffect, useState } from 'react'
import './UpdatePassword.css'
import { Typography,Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserPassword } from '../../Actions/User'
import { useAlert } from 'react-alert'
import { CLEAR_ERRORS } from '../../Constants/UserConstants'
import { CLEAR_MESSAGE } from '../../Constants/PostConstants'


const UpdatePassword = () => {
    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");

    const dispatch = useDispatch();
    const alert = useAlert();

    const {error,loading,message} = useSelector(state=>state.updateUser)

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(updateUserPassword(oldPassword,newPassword));
    }

    //start form use effect here
    useEffect(()=>{
      console.log("user updated message",message)
      if(error){
        alert.error(error);
        dispatch({type:CLEAR_ERRORS})
      }

      if(message){
          console.log('inside the if ',message)
          alert.success(message);
          dispatch({type:CLEAR_MESSAGE})
      }
  
    },[dispatch,error,alert,message]);

  return (
    <div className='updatePassword'>
        <form className='updatePasswordForm' onSubmit={submitHandler}>
            <Typography variant='h3' style={{padding:"2vmax"}}>Social App</Typography>

            <input type="password" placeholder='old Password' required value={oldPassword} className='updatePasswordInputs' onChange={(e)=>setOldPassword(e.target.value)}/>
            <input type="password" placeholder='new Password' required value={newPassword} className='updatePasswordInputs' onChange={(e)=>setNewPassword(e.target.value)}/>

            <Button disabled={loading} type="submit">Change Password</Button>

        </form>
    </div>
  )
}

export default UpdatePassword