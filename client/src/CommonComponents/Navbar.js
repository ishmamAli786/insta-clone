import React,{useContext,useEffect,useRef,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {UserContext} from '../App';
import nextId from "react-id-generator";
import M from 'materialize-css';


const NavBar=()=>{
  const searchModal = useRef(null)
  const {state,dispatch} =useContext(UserContext)
  const [search,setSearch] =useState('')
  const [email,setEmail] =useState([])
  // const {auth,setAuth} =useState('')
  // console.log(state)
  const navigate = useNavigate()
  
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])


  useEffect(()=>{
    //   localStorage.clear()
    // dispatch({type:"CLEAR"})
    // navigate('/signin')
    const user=JSON.parse(localStorage.getItem("myUser"))
    if(user){
      ///// adding user data into userreducer on page load
      dispatch({type:"USER",payload:user})
      // navigate('/')
    }else{
      navigate('/signin')
      localStorage.clear()
    dispatch({type:"CLEAR"})
    }
  },[])


  const handleLogout=()=>{
    localStorage.clear()
    dispatch({type:"CLEAR"})
    navigate('/signin')
  }

  const renderList=()=>{
    if(state==null){
      return(
        <>
        <li><Link to="/signin">Signin</Link></li>
        <li><Link to="/signup">Signup</Link></li>
            </>
      )
    }else{
      return(
        <>
        <li><i data-target="modal1" className="material-icons modal-trigger" style={{color:"black",cursor:"pointer"}}>search</i></li>
        <li><Link to="/createPost">Create New Post</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/myFollowingPost">My Following Post</Link></li>
        <li> <button onClick={()=>handleLogout()} className="btn #c62828 red darken-3"> Logout </button>
       </li>
       </>
      )
    }
  }

  const fetchUsers=async (query)=>{
    setSearch(query) 
    const response=await fetch('/searchUser',{method:"post",headers:{"Content-Type":"application/json",headers:{"Authorization":"Bearer "+localStorage.getItem('myToken')}},body:JSON.stringify({query})})
    const resp =await response.json()
    setEmail(resp.record)
  }
   return(
    <nav className="main_navbar">
    <div className="nav-wrapper white">
      <Link to={state==null?"/signin":"/"}className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
    <div id="modal1" className="modal" ref={searchModal} style={{color:'black'}}>
        <div className="modal-content">
        <input type="text" value={search} onChange={(e)=>fetchUsers(e.target.value)} placeholder="Search Users"/>
        <ul className="collection">
          {
            email.map((item)=>{
              return(
                // <Link to={item._id !== state._id ? `/profile/${item._id}` :'/profile' } key={item._id} onClick={()=>M.Modal.getInstance(searchModal.current).close()}><li className="collection-item">{item.email}</li></Link>
                <Link to={`/profile/${item._id}`} key={item._id} onClick={()=>M.Modal.getInstance(searchModal.current).close()}><li className="collection-item">{item.email}</li></Link>
              )
            })
          }
      </ul>
        </div>
        <div className="modal-footer">
          <a href="#" className="modal-close waves-effect waves-green btn-flat">Close</a>
        </div>
      </div>
  </nav>
   )
}


export default NavBar;