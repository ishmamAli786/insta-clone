import React,{useState,useEffect,useContext} from 'react';
import { UserContext } from '../App';
import M from 'materialize-css';
import {Link} from 'react-router-dom';
import Loader from 'react-js-loader'

export default function SubUserPost() {
    //// state will give global user mean to say more then one user
    const {state,dispatch} =useContext(UserContext)
    const [allpost,setAllPost] =useState([])
    // console.log("The Value Of All Post Is",allpost)
    useEffect(()=>{
        const getData=async()=>{
            const res=await fetch('/getsubpost',{headers:{"Authorization":"Bearer "+localStorage.getItem('myToken')}})
            const getAlldata = await res.json()
            // console.log(getAlldata)
            if(getAlldata.message){
                setAllPost(getAlldata.getAllPost)
            }
            else if(getAlldata.error){
                M.toast({html:getAlldata.error})
            }
        }
        getData()
        
    },[allpost])

    const LikePost=async (id)=>{
        try{
            const res=await fetch('/likePost',{method:"put",headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem('myToken')},body:JSON.stringify({postId:id})})
            const getAlldata = await res.json()
            // console.log(getAlldata)
    
            // / newdata is a complete new array
            
            const newData=allpost.map((item)=>{
    
                /// return old record
                if(item._id == getAlldata.likes._id){
                    return getAlldata;
                }else{
                    /// return new record
                    return item;
                }
            })
            setAllPost(newData)
        }
        catch(err){
            console.log(err)
        }
    }


//     const LikePost = (id)=>{
//         fetch('/likePost',{method:"put",headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem('myToken')},body:JSON.stringify({postId:id})}).then(res=>res.json())
//         .then(result=>{
//                  //   console.log(result)
//           const newData = allpost.map(item=>{
//               if(item._id==result.likes._id){
//                   return result
//               }else{
//                   return item
//               }
//           })
//           setAllPost(newData)
//         }).catch(err=>{
//             console.log(err)
//         })
//   }


    const unLikePost=async (id)=>{
        try{
            const res=await fetch('/unlikePost',{method:"put",headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem('myToken')},body:JSON.stringify({postId:id})})
        const getAlldata = await res.json()
        // console.log(getAlldata)
        // newdata is a complete new array
        const newData=allpost.map((item)=>{

            /// return old record
            if(item._id == getAlldata.likes._id){
                return getAlldata;
            }else{
                /// return new record
                return item;
            }
        })
        setAllPost(newData)
        }
        catch(err){
            console.log(err)
        }
    }


    const makeComment=async (text,postId)=>{
        try{
            const res=await fetch('/comment',{method:"put",headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem('myToken')},body:JSON.stringify({text,postId})})
            const getAlldata = await res.json()
            // console.log(getAlldata)
            const newData=allpost.map((item)=>{

                /// return old record
                if(item._id == getAlldata.comments._id){
                    return getAlldata;
                }else{
                    /// return new record
                    return item;
                }
            })
            setAllPost(newData)
        }
        catch(err){
            console.log(err)
        }
    }


    //  const hanldeSubmitData=(e)=>{
    //      e.preventDefault()
    //      makeComment(e.target[0].value,state._id)
    //  }


    const deletePost=async (id)=>{
        try{
            const res=await fetch(`/deletePost/${id}`,{method:"delete",headers:{"Authorization":"Bearer "+localStorage.getItem('myToken')}})
            const result = await res.json()
            // console.log(result)
            const newData=allpost.filter((item)=>{
                return item._id != result._id
            })
            setAllPost(newData)
        }
        catch(err){
            console.log(err)
        }
    }


    const deleteComment=async (id)=>{
        try{
            const res=await fetch(`/deleteComment/${id}`,{method:"delete",headers:{"Authorization":"Bearer "+localStorage.getItem('myToken')}})
            const result = await res.json()
            console.log(result)
            const newData=allpost.filter((item)=>{
                return item._id != result._id
            })
            setAllPost(newData)
        }
        catch(err){
            console.log(err)
        }
    }

    // const deleteComment=async (id)=>{
    //     try{
    //         const res=await fetch(`/deleteComment${id}`,{method:"put",headers:{"Authorization":"Bearer "+localStorage.getItem('myToken')}})
    //         const getAlldata = await res.json()
    //         // console.log(getAlldata)
    //         const newData=allpost.map((item)=>{

    //             /// return old record
    //             if(item._id !== getAlldata.comments._id){
    //                 return getAlldata;
    //             }else{
    //                 /// return new record
    //                 return item;
    //             }
    //         })
    //         setAllPost(newData)
    //     }
    //     catch(err){
    //         console.log(err)
    //     }
    // }

    return (
        <div className="home">
            {
                allpost.length > 0? allpost.map((post,ind)=>{
                    return(
                        <div key={ind}>
                <div className="card home-card">
                <h5 style={{padding:'15px'}}><Link to={post.postedBy._id !== state.user._id?`/profile/${post.postedBy._id}`:`/profile/`}>{post.postedBy.name}</Link>
                {
                    post.postedBy._id === state.user._id ? <i className="material-icons" onClick={()=>deletePost(post._id)} style={{color:'red',cursor:"pointer",marginRight:'10px',float:'right'}}>delete</i> :""
                }
                
                </h5>
                <div className="card-image">
                    {
                        post.photo ?<img src={post.photo} alt="image"/>:"Loading"
                    }
                    
                </div>
                <div className="card-content">
                <i className="material-icons" onClick={()=>LikePost(post._id)} style={{color:'red',marginRight:'10px'}}>favorite</i> 
                
                {post.likes.includes(state.user._id)?<i className="material-icons" style={{marginLeft:"15px",cursor:'pointer'}} onClick={()=>unLikePost(post._id)}>thumb_down</i>:<i className="material-icons" onClick={()=>LikePost(post._id)} style={{cursor:'pointer'}}>thumb_up</i>}
                
                    <h6>{post.likes.length} Likes</h6>
                    <h6>{post.title}</h6>
                    {
                        post.comments.length > 0 ?post.comments.map((comment,ind)=>{
                            return(
                                <h6 key={ind}><span style={{fontWeight:'bold'}}>{comment.postedBy.name} </span>
                                {comment.text} <i className="material-icons"  style={{color:'red',cursor:"pointer",float:'right'}}>delete_forever</i> 
                                </h6>
                            )
                        }):""
                    }


                    <p>{post.body}</p>
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        makeComment(e.target[0].value,post._id)
                        
                    }}>
                    <input type="text" placeholder="Add a Comment"/>
                    </form>
                </div>
            </div>
                        </div>
                    )
                })
                :"Loading..."
            }
        </div>
    )
}
