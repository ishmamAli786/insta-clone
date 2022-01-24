import React,{useState,useEffect} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import M from 'materialize-css';

export default function Signup() {
    const naviagte=useNavigate()
    const [name,setName]=useState('')
    const [password,setPassword]=useState('')
    const [email,setEmail]=useState('')
    const [image,setImage]=useState('')
    const [url,setUrl]=useState(undefined)


    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])


    const uploadPic =async ()=>{
        try{

            /// upload image into cloudnairy
        const data=new FormData()
        data.append("file",image)
        data.append("upload_preset","instagram-image")
        data.append("cloud_name","ishmam")
        const res=await fetch('https://api.cloudinary.com/v1_1/ishmam/image/upload',{method:"post",body:data})
        /// in response get image from cloudnairy
        const datas=await res.json()
        setUrl(datas.url)
        // console.log("url Of Image Is",url)
        }
        catch(err){
            M.toast({html:err,classes:"#c62828 red darken-3"}) 
        }
    }

    const uploadFields=async ()=>{
        if(email){
            if(!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
                return M.toast({html:"Invalid Email",classes:"#c62828 red darken-3"}) 
            }
        }
        /// when we call with fetch we should call with json function
        const res=await fetch('/signup',{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,password,email,pic:url})})
        const data=await res.json()
        if(data.message){
            M.toast({html:data.message,classes:"#43a047 green darken-1"})
            naviagte('/signin')
        }
        else if(data.error){
            M.toast({html:data.error,classes:"#c62828 red darken-3"}) 
        }
    }

    const postData = async ()=>{
        try{
            if(image){
                uploadPic()
            }else{
                uploadFields()
            }
        }catch(err){
            M.toast({html:err})
        }
    }

    return (
        <div className="myCard">
        <div className="card auth_card">
            <h2>Instagram</h2>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name"/>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}  placeholder="Password"/>

            <div className="file-field input-field">
            <div className="btn">
            <span>Upload Pic</span>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
           </div>
           <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
          </div>
          </div>

          <button className="btn waves-effect waves-light" onClick={()=>postData()}>
            Signup
            </button>
            <h5>Already Have An Account?<Link to='/signin'>Signin</Link></h5>
      </div>
        </div>
    )
}
