import React, { useEffect, useState } from 'react'
import './Register.css'
import { Avatar, Button, Typography } from '@mui/material'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { registerUser } from '../../Actions/User'
import { useAlert } from 'react-alert'
import { CLEAR_ERRORS } from '../../Constants/UserConstants'


const Register = () => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const {loading,error} = useSelector((state=>state.user))


  const [name,setName] = useState()
  const [email,setEmail] = useState()
  const [password,setPassword] = useState()
  const [avatar,setAvatar] = useState()

  

  const submitHandler = (e)=>{
    e.preventDefault();
    console.log(name,email,password,"regestering user")
    dispatch(registerUser(name,email,password,avatar));

  }

  
  const handleImageChange = (e) =>{
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () =>{
        if(Reader.readyState==2){
            // console.log(Reader.result)
            setAvatar(Reader.result);
        }
    }
  }

  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch({type:CLEAR_ERRORS})
    }
  },[dispatch,error,alert]);

  return (
    <div className='register'>
        <form className="registerForm" onSubmit={submitHandler}>
        <Typography variant='h3' style={{padding:"2vmax"}}>Social App</Typography>

        <Avatar src={avatar} alt='user' sx={{height:'10vmax',width:'10vmax'}}/>
        <input type="file" accept='image/*' onChange={handleImageChange}/>
        <input className='registerInputs' type="text" placeholder='Name' value={name} required onChange={(e)=>setName(e.target.value)}/>
        <input className='registerInputs' type="email" placeholder='Email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <input className='registerInputs' type="password" placeholder='Password' required value={password} onChange={(e)=>setPassword(e.target.value)}/>

        <Link to='/'><Typography>Already Signed Up? Login Now</Typography></Link>

        <Button disabled={loading} type="submit">Sign Up</Button>

        </form>
    </div>
  )
}

export default Register