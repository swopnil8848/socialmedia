import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Header from './components/Header/Header';
import Login from './components/Login/Login.tsx';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './Actions/User.js';
import Home from './components/Home.js/Home.jsx';
import Account from './components/Account/Account.jsx';
import NewPost from './components/NewPost/NewPost.jsx';
import Register from './components/Register/Register.jsx';
import UpdateProfile from './components/UpdateProfile/UpdateProfile.jsx';
import UpdatePassword from './components/updatePassword/UpdatePassword.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from './ResetPassword/ResetPassword.jsx';
import UserProfile from './components/UserProfile/UserProfile.jsx';
import Search from './components/Search/Search.jsx';
import NotFound from './components/NotFound/NotFound.jsx';

function App() {

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(loadUser());
  },[dispatch]);

  const {isAuthenticated} = useSelector((state)=>state.user)

  return (
    <Router>
      <div className="App"></div>
      {isAuthenticated && <Header/>}
      <Routes>
        <Route path='/' element={isAuthenticated?<Home/>:<Login/>}/>
        <Route path='/account' element={isAuthenticated?<Account/>:<Login/>}/>
        <Route path='/newpost' element={isAuthenticated?<NewPost/>:<Login/>}/>
        <Route path='/register' element={isAuthenticated?<Account/>:<Register/>}/>
        <Route path='/update/profile' element={isAuthenticated?<UpdateProfile/>:<login/>}/>
        <Route path='/update/password' element={isAuthenticated?<UpdatePassword/>:<login/>}/>
        <Route path='/forgot/password' element={isAuthenticated?<UpdatePassword/>:<ForgotPassword/>}/>
        <Route path='/password/reset/:token' element={isAuthenticated?<UpdatePassword/>:<ResetPassword/>}/>
        <Route path='/user/:id' element={isAuthenticated?<UserProfile/>:<Login/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
