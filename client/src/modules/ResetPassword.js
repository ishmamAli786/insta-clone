import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import M from 'materialize-css';


export default function ResetPassword() {
    const naviagte=useNavigate()
    const [email,setEmail]=useState('')

    const resetPassword = async ()=>{
        try{
            if(email){
                if(!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
                   return M.toast({html:"Invalid Email",classes:"#c62828 red darken-3"}) 
                }
            }
            /// when we call with fetch we should call with json function
            const res=await fetch('/resetPassword',{method:"put",body:JSON.stringify({email})})
            const data=await res.json()
            // console.log(data)
            if(data.message){
                // const user=data.user;
                // localStorage.setItem(data.JSON.stringify({'myUser':user}))
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                // naviagte('/')
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
            <button onClick={()=>resetPassword()} className="btn waves-effect waves-light">
            Reset Password
            </button>
      </div>
        </div>
    )
}
