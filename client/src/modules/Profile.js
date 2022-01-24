import React,{useState,useEffect,useContext} from 'react';
import M from 'materialize-css';
import { UserContext} from '../App';

export default function Profile() { // console.log(getMyPostData)
    const {state,dispatch} =useContext(UserContext)
    const [myPic,SetMyPic] =useState([])
    const [loading,setLoading] =useState(false)
    const [image,setImage]    =useState('')
    // console.log("The Value Of State IS",state)
    useEffect(async ()=>{
       try{
        const res=await fetch('/myPost',{headers:{"Authorization":"Bearer "+localStorage.getItem('myToken')}})
        const getMyPostData = await res.json()
        // console.log(getMyPostData)
        if(getMyPostData.message){
            SetMyPic(getMyPostData.getAllMyPost)
            setLoading(true)
            /////window.location.reload()
        }
        else if(getMyPostData.error){
            M.toast({html:getMyPostData.error})
        } 
       }
       catch(error){
        M.toast({error})
       }
        
    },[])


    useEffect(async ()=>{
        if(image){
            const data=new FormData()
            data.append("file",image)
            data.append("upload_preset","instagram-image")
            data.append("cloud_name","ishmam")
            const res=await fetch('https://api.cloudinary.com/v1_1/ishmam/image/upload',{method:"post",body:data})
            /// in response get image from cloudnairy
            const datas=await res.json()
           const result=await fetch('/updatePic',{method:"put",headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem('myToken')},body:JSON.stringify({pic:datas.url})})
               const result1 =await result.json()
            localStorage.setItem("user",JSON.stringify({...state,pic:result1.result.pic}))
            dispatch({action:"USER",payload:'ishmam'})
        //    console.log(result1.result.pic)
            // window.locaton.reload()
            // console.log("url Of Image Is",url)
            }
    },[image])
    const updatePhoto=async (file)=>{
            setImage(file)
            /// upload image into cloudnairy
    }
    return (
        <>
        {
            loading ?
            <div style={{maxWidth:"550px",margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-around',margin:'18px 0px',borderBottom:'1px solid gray'}}>
                <div>
                    <img style={{width:'160px',height:'160px',borderRadius:"80px"}} src={state ? state.user.pic : "loading..."} alt="image"/>
                    <div className="file-field input-field">
                    <div className="btn">
                    <span>Update Pic</span>
                 <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])}/>
                 </div>
                 <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" />
                  </div>
                    </div>
                </div>
                <div>
                    <h4>{state.user==null? "loading...":state.user.name}</h4>
                    <h4>{state.user==null? "loading...":state.user.email}</h4>
                    <div style={{display:'flex',justifyContent:'space-between',width:"108%"}}>
                        <h6>{myPic.length} Posts</h6>
                        <h6>{state.followers.length > 0 ? state.followers.length: "0"} Followers </h6>{/* <h6>{state.name} Followers</h6> */}
                        <h6>{state.following.length > 0 ? state.following.length: "0"} Following </h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {myPic.length > 0?myPic.map((photos,ind)=>{
                    return(
                       
                        <img key={ind} className="item" src={photos.photo} alt={photos.title}/>
                       
                    )
                }):"Loading..."}
                    

                </div>
        </div>:"loading..."
        }
        </>
    )
}
