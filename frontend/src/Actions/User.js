import axios from 'axios'
import { ALL_USER_FAIL, ALL_USER_REQUEST, ALL_USER_SUCCESS, DELETE_USER_FAIL, DELETE_USER_REQUEST, FOLLOW_USER_FAIL, FOLLOW_USER_REQUEST, FOLLOW_USER_SUCCESS, FORGOT_PASSWORD_FAIL, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, LOAD_USER_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_REQUEST, LOGOUT_SUCCESS, POST_OF_FOLLOWING_FAILURE, POST_OF_FOLLOWING_REQUEST, POST_OF_FOLLOWING_SUCCESS, REGISTER_USER_FAIL, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, RESET_PASSWORD_FAIL, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAIL, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PROFILE_FAIL, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, USER_PROFILE_FAIL, USER_PROFILE_REQUEST, USER_PROFILE_SUCCESS } from '../Constants/UserConstants'
import { DELETE_COMMENT_SUCCESS, MY_POST_FAILURE, MY_POST_REQUEST, MY_POST_SUCCESS, UPDATE_CAPTION_SUCCESS } from '../Constants/PostConstants'

export const loginUser = (email,password)=>async (dispatch)=>{
    try{

        dispatch({type:LOGIN_REQUEST})
        const {data} = await axios.post('/api/v1/login',{email,password},{
        // const {data} = await axios.post('http://localhost:3000/api/v1/login',{email,password},{
            headers:{
                "Content-Type":"application/json",
            },
            withCredentials:true
        })

        dispatch({type:LOGIN_SUCCESS,payload:data.user})

    }catch(error){
        dispatch({type:LOGIN_FAIL,payload:error.response.data.message})
    }
}

export const loadUser = ()=>async (dispatch)=>{
    try{

        dispatch({type:LOAD_USER_REQUEST})

        const {data} = await axios.get('/api/v1/me',{withCredentials:true})
        // const {data} = await axios.get('http://localhost:3000/api/v1/me',{withCredentials:true})

        dispatch({type:LOAD_USER_SUCCESS,payload:data.user})

    }catch(error){
        dispatch({type:LOAD_USER_FAIL,payload:error.response.data.message})
    }
}

export const getFollowingPosts = ()=> async(dispatch)=>{
    try{
        dispatch({type:POST_OF_FOLLOWING_REQUEST})

        // const {data} = await axios.get('http://localhost:3000/api/v1/posts',{withCredentials:true});
        const {data} = await axios.get('/api/v1/posts',{withCredentials:true});

        dispatch({type:POST_OF_FOLLOWING_SUCCESS,payload:data.posts})
        
    }catch(error){
        dispatch({type:POST_OF_FOLLOWING_FAILURE,payload:error.response.data.message})
    }
}

export const getMyPosts = ()=> async(dispatch)=>{
    try{
        dispatch({type:MY_POST_REQUEST})

        // const {data} = await axios.get('http://localhost:3000/api/v1/my/posts',{withCredentials:true});
        const {data} = await axios.get('/api/v1/my/posts',{withCredentials:true});

        dispatch({type:MY_POST_SUCCESS,payload:data.posts})
        
    }catch(error){
        dispatch({type:MY_POST_FAILURE,payload:error.response.data.message})
    }
}

export const getAllUsers = (name='')=> async(dispatch)=>{
    try{
        dispatch({type:ALL_USER_REQUEST})

        const {data} = await axios.get(`/api/v1/users?name=${name}`,{withCredentials:true});
        // const {data} = await axios.get(`http://localhost:3000/api/v1/users?name=${name}`,{withCredentials:true});

        dispatch({type:ALL_USER_SUCCESS,payload:data.users})

    }catch(error){
        dispatch({type:ALL_USER_FAIL,payload:error.response.data.message})
    }
}

export const logoutUser = (email,password)=>async (dispatch)=>{
    try{

        dispatch({type:LOGOUT_REQUEST})

        await axios.get('/api/v1/logout',{withCredentials:true})
        // await axios.get('http://localhost:3000/api/v1/logout',{withCredentials:true})

        dispatch({type:LOGOUT_SUCCESS})

    }catch(error){
        dispatch({type:LOGOUT_FAIL,payload:error.response.data.message})
    }
}

export const registerUser = (name,email,password,avatar)=>async (dispatch)=>{
    try{

        dispatch({type:REGISTER_USER_REQUEST})
        const {data} = await axios.post('/api/v1/register',{name,email,password,avatar},{
        // const {data} = await axios.post('http://localhost:3000/api/v1/register',{name,email,password,avatar},{
            headers:{
                "Content-Type":"application/json",
            },
            withCredentials:true
        })

        dispatch({type:REGISTER_USER_SUCCESS,payload:data.user})

    }catch(error){
        dispatch({type:REGISTER_USER_FAIL,payload:error.response.data.message})
    }
}

export const updateUserProfile = (name,email,avatar)=>async (dispatch)=>{
    try{

        dispatch({type:UPDATE_PROFILE_REQUEST})
        const {data} = await axios.put('/api/v1/update/profile',{name,email,avatar},{
        // const {data} = await axios.put('http://localhost:3000/api/v1/update/profile',{name,email,avatar},{
            headers:{
                "Content-Type":"application/json",
            },
            withCredentials:true
        })

        dispatch({type:UPDATE_PROFILE_SUCCESS,payload:data.message})

    }catch(error){
        dispatch({type:UPDATE_PROFILE_FAIL,payload:error.response.data.message})
    }
}

export const updateUserPassword = (oldPassword,newPassword)=>async (dispatch)=>{
    try{

        dispatch({type:UPDATE_PASSWORD_REQUEST})
        const {data} = await axios.put('/api/v1/update/password',{oldPassword,newPassword},{
        // const {data} = await axios.put('http://localhost:3000/api/v1/update/password',{oldPassword,newPassword},{
            headers:{
                "Content-Type":"application/json",
            },
            withCredentials:true
        })

        dispatch({type:UPDATE_PASSWORD_SUCCESS,payload:data.message})

    }catch(error){
        dispatch({type:UPDATE_PASSWORD_FAIL,payload:error.response.data.message})
    }
}

export const deleteME = (oldPassword,newPassword)=>async (dispatch)=>{
    try{

        dispatch({type:DELETE_USER_REQUEST})
        // const {data} = await axios.delete('http://localhost:3000/api/v1/delete/me',{
        const {data} = await axios.delete('/api/v1/delete/me',{
            withCredentials:true
        })

        dispatch({type:DELETE_COMMENT_SUCCESS,payload:data.message})

    }catch(error){
        dispatch({type:DELETE_USER_FAIL,payload:error.response.data.message})
    }
}

export const forgotPassword = (email)=>async (dispatch)=>{
    try{

        dispatch({type:FORGOT_PASSWORD_REQUEST})
        const {data} = await axios.post('/api/v1/forgot/password',{email},{
        // const {data} = await axios.post('http://localhost:3000/api/v1/forgot/password',{email},{
            headers:{
                "Content-Type":"application/json",
            },
            withCredentials:true
        })

        dispatch({type:FORGOT_PASSWORD_SUCCESS,payload:data.message})

    }catch(error){
        dispatch({type:FORGOT_PASSWORD_FAIL,payload:error.response.data.message})
    }
}

export const resetPassword = (token,password)=>async (dispatch)=>{
    try{

        dispatch({type:RESET_PASSWORD_REQUEST})
        const {data} = await axios.put(`/api/v1/password/reset/${token}`,{password},{
        // const {data} = await axios.put(`http://localhost:3000/api/v1/password/reset/${token}`,{password},{
            headers:{
                "Content-Type":"application/json",
            },
            withCredentials:true
        })

        dispatch({type:RESET_PASSWORD_SUCCESS,payload:data.message})

    }catch(error){
        dispatch({type:RESET_PASSWORD_FAIL,payload:error.response.data.message})
    }
}


export const getuserProfile = (id)=> async(dispatch)=>{
    try{
        dispatch({type:USER_PROFILE_REQUEST})

        const {data} = await axios.get(`/api/v1/user/${id}`,{withCredentials:true});
        // const {data} = await axios.get(`http://localhost:3000/api/v1/user/${id}`,{withCredentials:true});
        
        dispatch({type:USER_PROFILE_SUCCESS,payload:data.user})
        
    }catch(error){
        dispatch({type:USER_PROFILE_FAIL,payload:error.response.data.message})
    }
}

export const followAndUnfollowUser = (id)=> async(dispatch)=>{
    try{
        dispatch({type:FOLLOW_USER_REQUEST})

        const {data} = await axios.get(`/api/v1/follow/${id}`,{withCredentials:true});
        // const {data} = await axios.get(`http://localhost:3000/api/v1/follow/${id}`,{withCredentials:true});

        dispatch({type:FOLLOW_USER_SUCCESS,payload:data.user})
        
    }catch(error){
        dispatch({type:FOLLOW_USER_FAIL,payload:error.response.data.message})
    }
}

