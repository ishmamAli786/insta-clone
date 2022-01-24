import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './CommonComponents/Navbar';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import LandingPage from './modules/LandingPage';
import Profile from './modules/Profile';
import CreatePosts from './modules/CreatePost';
import {useNavigate,useLocation} from 'react-router-dom';
import {userReducer,initialState} from './reducers/userReducers';
import PrivateSignin from './privateRoute/privateSignin';
import PrivateSignup from './privateRoute/privateSignup';
import UserProfile from './modules/UserProfile';
import SUbScribrUSer from './modules/SubUserPost';
import ResetPassword from './modules/ResetPassword';
import NewPassword from './modules/NewPassword';

export const UserContext=createContext();


/// If We Want to Redirect User From App Then First We Add In An Component
const Routing=()=>{
  const location =useLocation()
  const navigate=useNavigate()
  const {state,dispatch} =useContext(UserContext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("myUser"))
    if(user){
      ///// adding user data into userreducer on page load
      dispatch({type:"USER",payload:user})
      // console.log("The Value Of State In Main File Is",state)
      // navigate('/')
    }else{
      if(!location.pathname.startsWith('/reset')) 
      navigate('/signin')
    }
  },[])
  return(
    <>
     <Routes>
       <Route path='/' element={<LandingPage/>}></Route>
       <Route path='/signin' element={<PrivateSignin/>}></Route>
       <Route path='/profile' element={<Profile />}></Route>
       <Route path='/signup' element={<PrivateSignup />}></Route>
       <Route path='/createPost' element={<CreatePosts />}></Route>
       <Route path='/profile/:id' element={<UserProfile />}></Route>
       <Route path='/myFollowingPost' element={<SUbScribrUSer/>}></Route>
       <Route path='/resetPassword' element={<ResetPassword/>}></Route>
       <Route path='/reset/:token' element={<NewPassword/>}></Route>
     </Routes>
    </>
  )
}

function App() {
  const [state,dispatch]=useReducer(userReducer,initialState)
  return (
    <>
    <UserContext.Provider value={{state,dispatch}}>
    <Router>
    <Navbar/>
   <Routing/>
     </Router>
     </UserContext.Provider>
    </>
  );
}

export default App;
