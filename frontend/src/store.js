import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { allUsersReducer, postOfFollowingReducer, updateUser, userProfileReducer, userReducer } from "./Reducers/User";
import { likeReducer, myPostReducer, userPostReducer } from "./Reducers/Post";

const middleware = [thunk];

const reducer = combineReducers({
    user: userReducer,
    postOfFollowing:postOfFollowingReducer,
    allUsers:allUsersReducer,
    like:likeReducer,
    myPosts:myPostReducer,
    updateUser:updateUser,
    userProfile:userProfileReducer,
    userPosts:userPostReducer
});

const initialState = {};
 
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
