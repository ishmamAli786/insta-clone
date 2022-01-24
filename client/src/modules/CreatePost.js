import React,{useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import M from 'materialize-css';

function CreatePosts() {
    const [title,setTitle] = useState('')
    const [body,setBody] = useState('')
    const [image,setImage] = useState('')
    const [url,setUrl] = useState('')
    const navigate=useNavigate()

    useEffect(()=>{
        const getResponse=async ()=>{
            if(url){
                const response= await fetch('/createPost',{method:"post",headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem('myToken')},body:JSON.stringify({title,body,pic:url})})
                const getResponse=await response.json()
                     if(getResponse.message){
                         M.toast({html:getResponse.message,classes:"#43a047 green darken-1"})
                         navigate('/')
                     }
                     else if(getResponse.error){
                         M.toast({html:getResponse.error,classes:"#c62828 red darken-3"}) 
                     }
            }
        }
        getResponse()
    },[`${url}`])

    const postDetails =async ()=>{
        try{
        const data=new FormData()
        data.append("file",image)
        data.append("upload_preset","instagram-image")
        data.append("cloud_name","ishmam")
        const res=await fetch('https://api.cloudinary.com/v1_1/ishmam/image/upload',{method:"post",body:data})
        const datas=await res.json()
        setUrl(datas.url)
        // console.log("url Of Image Is",url)
        }
        catch(err){
            M.toast({html:err,classes:"#c62828 red darken-3"}) 
        }
    }

    return (
        <div className="card input-field" style={{margin:'30px auto',maxWidth:'500px',padding:'20px',textAlign:'center'}}>
            <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="title"/>
            <input type="text" value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Body"/>
            <div className="file-field input-field">
            <div className="btn">
            <span>Upload Image</span>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
           </div>
           <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
          </div>
          </div>
          <button className="btn waves-effect waves-light" onClick={()=>postDetails()}>
            Submit Post
            </button>
        </div>
    )
}

export default CreatePosts;
