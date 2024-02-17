import React, { useEffect, useState } from 'react'
import './ResetPassword.css'

import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { resetPassword } from '../Actions/User';
import { Link, useParams } from 'react-router-dom';
import { CLEAR_MESSAGE } from '../Constants/PostConstants';
import { CLEAR_ERRORS } from '../Constants/UserConstants';

const ResetPassword = () => {

    const [newPassword,setNewPassword] = useState("");
    const dispatch = useDispatch();
    const alert = useAlert();
    const params = useParams();
    // console.log("params",params)
    const {error,loading,message} = useSelector((state)=>state.updateUser);


    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(resetPassword(params.token,newPassword));
    }

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch({type:CLEAR_ERRORS})
        }

        if(message){
            alert.success(message);
            dispatch({type:CLEAR_MESSAGE})
        }
    },[alert,error,message,dispatch])

  return (
    <div className='resetPassword'>
        <form className='resetPasswordForm' onSubmit={submitHandler}>
            <Typography variant='h3' style={{padding:"2vmax"}}>Social App</Typography>

            <input type="password" placeholder='new Password' required value={newPassword} className='updatePasswordInputs' onChange={(e)=>setNewPassword(e.target.value)}/>

            <Link to='/forgot/password'><Typography>Request Another Token</Typography></Link>

            <Button disabled={loading} type="submit">Reset Password</Button>

        </form>
    </div>
  )
}

export default ResetPassword