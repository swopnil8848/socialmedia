import React, { useEffect, useState } from 'react'
import './ForgotPassword.css'
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { CLEAR_ERRORS } from '../../Constants/UserConstants'
import { CLEAR_MESSAGE } from '../../Constants/PostConstants'
import { forgotPassword } from '../../Actions/User'


const ForgotPassword = () => {

    const [email,setEmail] = useState("")

    const dispatch = useDispatch();
    const alert = useAlert();

    const {error,loading,message} = useSelector((state)=>state.updateUser);
    
    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(forgotPassword(email))
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
    <div className='forgotPassword'>
    <form className='forgotPasswordForm' onSubmit={submitHandler}>
        <Typography variant='h3' style={{padding:"2vmax"}}>Social App</Typography>

        <input className='forgotPasswordInputs' type="email" placeholder='Email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>

        <Button disabled={loading}  type="submit">Send Token</Button>

    </form>
</div>
  )
}

export default ForgotPassword