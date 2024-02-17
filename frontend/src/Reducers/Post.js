import { ADD_COMMENT_FAIL, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, CLEAR_MESSAGE, DELETE_COMMENT_FAIL, DELETE_COMMENT_REQUEST, DELETE_COMMENT_SUCCESS, DELETE_POST_FAILURE, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, LIKE_FAILURE, LIKE_REQUEST, LIKE_SUCCESS, MY_POST_FAILURE, MY_POST_REQUEST, MY_POST_SUCCESS, NEW_POST_FAILURE, NEW_POST_REQUEST, NEW_POST_SUCCESS, UPDATE_CAPTION_FAILURE, UPDATE_CAPTION_REQUEST, UPDATE_CAPTION_SUCCESS, USER_POST_FAILURE, USER_POST_REQUEST, USER_POST_SUCCESS } from "../Constants/PostConstants"
import { CLEAR_ERRORS } from "../Constants/UserConstants"

export const likeReducer = (state = {}, action) => {
    switch(action.type){
        case LIKE_REQUEST:
        case ADD_COMMENT_REQUEST:
        case DELETE_COMMENT_REQUEST:
        case NEW_POST_REQUEST:
        case UPDATE_CAPTION_REQUEST:
        case DELETE_POST_REQUEST:
            return{
               loading:true 
            }
        case LIKE_SUCCESS:
        case ADD_COMMENT_SUCCESS:
        case DELETE_COMMENT_SUCCESS:
        case NEW_POST_SUCCESS:
        case UPDATE_CAPTION_SUCCESS:
        case DELETE_POST_SUCCESS:
            return{
                ...state,
               loading:false,
               message:action.payload
            }
        case LIKE_FAILURE:
        case ADD_COMMENT_FAIL:
        case DELETE_COMMENT_FAIL:
        case NEW_POST_FAILURE:
        case UPDATE_CAPTION_FAILURE:
        case DELETE_POST_FAILURE:
            return{
                ...state,
               loading:false,
               error:action.payload
            }
        case CLEAR_ERRORS:
            return{
                ...state,
                error:null,
            }
        case CLEAR_MESSAGE:
            return{
                ...state,
                message:null
            }
        default:
            return state
    }
}

export const myPostReducer = (state={},action)=>{
    switch(action.type){
        case MY_POST_REQUEST:
            return{
                loading:true
            }
        case MY_POST_SUCCESS:
            return{
                ...state,
                loading : false,
                posts : action.payload
            }
        case MY_POST_FAILURE:
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        case CLEAR_ERRORS:
            return {
                error:null
            }
        default:
            return state
    }
}

export const userPostReducer = (state={},action)=>{
    switch(action.type){
        case USER_POST_REQUEST:
            return{
                loading:true
            }
        case USER_POST_SUCCESS:
            return{
                ...state,
                loading : false,
                posts : action.payload
            }
        case USER_POST_FAILURE:
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        case CLEAR_ERRORS:
            return {
                error:null
            }
        default:
            return state
    }
}