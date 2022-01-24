import React,{useState,useContext} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../App';
export default function Login() {
    const {state,dispatch} = useContext(UserContext)
    const naviagte=useNavigate()
    const [password,setPassword]=useState('')
    const [email,setEmail]=useState('')

    const signInUser = async ()=>{
        try{
            if(email){
                if(!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
                   return M.toast({html:"Invalid Email",classes:"#c62828 red darken-3"}) 
                }
            }
            /// when we call with fetch we should call with json function
            const res=await fetch('/signin',{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})})
            const data=await res.json()
            // console.log(data)
            if(data.message){
                localStorage.setItem('myToken',data.token)
                localStorage.setItem('myUser',JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                // const user=data.user;
                // localStorage.setItem(data.JSON.stringify({'myUser':user}))
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                naviagte('/')
            }
            else if(data.error){
                M.toast({html:data.error,classes:"#c62828 red darken-3"}) 
            }
        }catch(err){
            M.toast({html:err})
        }
    }
    return (
        <div className="myCard">
        <div className="card auth_card">
            <h2>Instagram</h2>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
            <button onClick={()=>signInUser()} className="btn waves-effect waves-light">
            Signin
            </button>
            <h5>Don't Have An Account?<Link to='/signup'>Signup</Link></h5>
            <Link to='/resetPassword'>Reset Password</Link>
      </div>
        </div>
    )
}
