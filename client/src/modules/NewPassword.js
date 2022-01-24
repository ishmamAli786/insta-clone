import React,{useState} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import M from 'materialize-css';



export default function NewPassword() {
    const {token} =useParams()
    const naviagte=useNavigate()
    const [password,setPassword]=useState('')
    console.log(token)

    const newPassword = async ()=>{
        try{
            /// when we call with fetch we should call with json function
            const res=await fetch('/newPassword',{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({password,token})})
            const data=await res.json()
            // console.log(data)
            if(data.message){
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
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter New Password"/>
            <button onClick={()=>newPassword()} className="btn waves-effect waves-light">
            New Password
            </button>
      </div>
        </div>
    )
}
