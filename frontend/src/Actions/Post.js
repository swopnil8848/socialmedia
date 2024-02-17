import axios from "axios";
import { ADD_COMMENT_FAIL, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, DELETE_COMMENT_FAIL, DELETE_COMMENT_REQUEST, DELETE_COMMENT_SUCCESS, DELETE_POST_FAILURE, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, LIKE_FAILURE, LIKE_REQUEST, LIKE_SUCCESS, NEW_POST_FAILURE, NEW_POST_REQUEST, NEW_POST_SUCCESS, UPDATE_CAPTION_FAILURE, UPDATE_CAPTION_REQUEST, UPDATE_CAPTION_SUCCESS, USER_POST_FAILURE, USER_POST_REQUEST, USER_POST_SUCCESS } from "../Constants/PostConstants";


export const likePost = (id)=> async(dispatch)=>{
    try{
        dispatch({type:LIKE_REQUEST})

        // const {data} = await axios.post(`http://localhost:3000/api/v1/post/${id}/`,{},{withCredentials:true});
        const {data} = await axios.post(`/api/v1/post/${id}/`,{},{withCredentials:true});

        dispatch({type:LIKE_SUCCESS,payload:data.message})

    }catch(error){
        dispatch({type:LIKE_FAILURE,payload:error.response.data.message})
    }
}

export const addCommentOnPost = (id,comment)=> async(dispatch)=>{
    try{
        dispatch({type:ADD_COMMENT_REQUEST})

        const { data } = await axios.put(
            // `http://localhost:3000/api/v1/post/comment/${id}/`,
            `/api/v1/post/comment/${id}/`,
            { comment },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        dispatch({type:ADD_COMMENT_SUCCESS,payload:data.message})

    }catch(error){
        dispatch({type:ADD_COMMENT_FAIL,payload:error.response.data.message})
    }
}

export const deleteCommentOnPost = (id, commentId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_COMMENT_REQUEST });

        const { data } = await axios.delete(
            `/api/v1/post/comment/${id}/`,
            // `http://localhost:3000/api/v1/post/comment/${id}/`,
            {
                data: { commentId }, // Pass commentId as data
                withCredentials: true, // Include withCredentials here
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        dispatch({ type: DELETE_COMMENT_SUCCESS, payload: data.message });

    } catch (error) {
        console.log(error);
        dispatch({ type: DELETE_COMMENT_FAIL, payload: error.response.data.message });
    }
};

export const createNewPost = (caption, image) => async (dispatch) => {
    try {
        dispatch({ type: NEW_POST_REQUEST });

        const { data } = await axios.post(
            `/api/v1/post/upload/`,{
            // `http://localhost:3000/api/v1/post/upload/`,{
                caption,
                image
            },{
                withCredentials:true,
                headers:{
                    "Content-Type":"application/json"
                },
            }
            
        );

        dispatch({ type: NEW_POST_SUCCESS, payload: data.message });

    } catch (error) {
        console.log(error);
        dispatch({ type: NEW_POST_FAILURE, payload: error.response.data.message });
    }
};

export const updatePost = (caption,id) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_CAPTION_REQUEST });

        const { data } = await axios.put(
            `/api/v1/post/${id}/`,{
            // `http://localhost:3000/api/v1/post/${id}/`,{
                caption
            },{
                withCredentials:true,
                headers:{
                    "Content-Type":"application/json"
                },
            }
            
        );

        dispatch({ type: UPDATE_CAPTION_SUCCESS, payload: data.message });

    } catch (error) {
        console.log(error);
        dispatch({ type: UPDATE_CAPTION_FAILURE, payload: error.response.data.message });
    }
};

export const deletePost = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_POST_REQUEST });

        const { data } = await axios.delete(
            `/api/v1/post/${id}/`,{
            // `http://localhost:3000/api/v1/post/${id}/`,{
                withCredentials:true
            }
        );

        dispatch({ type: DELETE_POST_SUCCESS, payload: data.message });

    } catch (error) {
        console.log(error);
        dispatch({ type: DELETE_POST_FAILURE, payload: error.response.data.message });
    }
};

export const getuserPosts = (id)=> async(dispatch)=>{
    try{
        dispatch({type:USER_POST_REQUEST})

        const {data} = await axios.get(`/api/v1/userposts/${id}`,{withCredentials:true});
        // const {data} = await axios.get(`http://localhost:3000/api/v1/userposts/${id}`,{withCredentials:true});

        console.log(data,"data of user")

        dispatch({type:USER_POST_SUCCESS,payload:data.posts})
        
    }catch(error){
        dispatch({type:USER_POST_FAILURE,payload:error.response.data.message})
    }
}
