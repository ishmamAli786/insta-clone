import React,{useState,useEffect,useContext} from 'react';
import M from 'materialize-css';
import { UserContext} from '../App';
import { useParams } from 'react-router';


export default function UserProfile() { // console.log(getMyPostData)
    const {id}=useParams();
    const {state,dispatch} =useContext(UserContext)
    const [userProfile,setUserProfile]=useState([])
    const [loading,setLoading] =useState(false)
    const [loadingFollow,setLoadingFollow] =useState(true)
    const [showFollow,setShowFollow] =useState(state ? !state.followers.includes(id):true)

    // console.log("The Value Of State Is",state)
    // console.log("The value Of User Is",userProfile)
    // console.log("The Value Of Loading Is",loading)

    // console.log("The Value Of State Is",state)


    useEffect(()=>{
        const fetchAllData=async ()=>{
            const res=await fetch(`/user/${id}`,{headers:{"Authorization":"Bearer "+localStorage.getItem('myToken')}})
            const getMyPostData = await res.json()
            // console.log("get My Post Is",getMyPostData)
            if(getMyPostData){
                setUserProfile(getMyPostData)
                setLoading(true)
                // setShowFollow(!showFollow)
            }
            else if(getMyPostData.error){
                M.toast({html:getMyPostData.error})
            }
        }
        fetchAllData()
    },[])


    //// follow user
    const followUSer=async ()=>{
        const response= await fetch('/follow',{method:"put",headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem('myToken')},body:JSON.stringify({followId:id})})
        const data=await response.json()
        const {resp} =data;
        console.log("The Value Of Response Is",resp.following)
        /// return
        if(resp){
            setUserProfile((previousState)=>{
                return{
                    ...previousState,user:{...previousState.user,followers:[...previousState.user.followers,resp._id]}
                }
            })
            dispatch({action:"UPDATE",payload:{following:resp.following,followers:resp.followers}})
            setLoadingFollow(true)
            localStorage.setItem('user',JSON.stringify(resp))
            setShowFollow(false)
        }
        else if(data.error){
            M.toast({html:data.error})
        }
    }

    //// unfollow user
    const unfollowUSer=async ()=>{
        const response= await fetch('/unfollow',{method:"put",headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem('myToken')},body:JSON.stringify({unfollowId:id})})
        const data=await response.json()
        const {resp} =data;
        /// return
        if(resp){

            setUserProfile((previousState)=>{
                const newFollower=previousState.user.followers.filter(item=> item !== resp._id)
                return{
                    ...previousState,user:{...previousState.user,followers:newFollower}
                }
            })
        dispatch({action:"UPDATE",payload:{following:resp.following,followers:resp.followers}})
        setLoadingFollow(true)
        localStorage.setItem('user',JSON.stringify(resp))
        setShowFollow(true)
        
        }
        else if(data.error){
            M.toast({html:data.error})
        }
    }

    return (
        <>
        {
            loading ?
            <div style={{maxWidth:"550px",margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-around',margin:'18px 0px',borderBottom:'1px solid gray'}}>
                <div>
                    <img style={{width:'160px',height:'160px',borderRadius:"80px"}} src={userProfile.user.pic} alt="image"/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:'flex',justifyContent:'space-between',width:"108%"}}>
                        <h6>{userProfile.post.length} Posts</h6>
                        <h6>{loadingFollow ? userProfile.user.followers.length :"0"} Followers</h6>
                        <h6>{loadingFollow ? userProfile.user.following.length :"0"} Following</h6>
                        {
                            // showFollow ==null ? 
                            showFollow ? <button onClick={()=>followUSer()}  className="btn #c62828 red darken-3">
                            Follow
                           </button>: <button onClick={()=>unfollowUSer()}  className="btn #c62828 red darken-3">
                          UnFollow
                         </button>
                        }
                    </div>
                </div>
            </div>
            <div className="gallery">
                {loading ? userProfile.post.map((photos,ind)=>{
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
