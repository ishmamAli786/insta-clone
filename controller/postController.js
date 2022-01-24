const postModel=require('../models/post');

module.exports.createPost=async (req,res)=>{
    const {title,body,pic}=req.body;
    // console.log(title,body,pic)
    if(!title,!body,!pic){
        return res.status(422).json({error:"Please Add All The Fields"})
    }
    // console.log(req.user)
    // return res.status(200).json({message:"Check The Data Of User Is"})
    try{
        //// overwritting password
        req.user.password=undefined
        const post=await postModel.create({title,body,photo:pic,postedBy:req.user}) 
        if(post){
            return res.status(200).json({message:"Post Created Successfully",post})
        }else{
            return res.status(400).json({error:"Invalid Credentials"})
        }
    }
    catch(err){
        return res.status(400).json({error:err,message:"Internal Server Error"})
    }
}


module.exports.viewPost=async (req,res)=>{
    try{

        //// populate function take all the value of postedby
        /// jb ham condition ni lagay gy ky kesse aik data ko ly kar ao to wo saray data ko ly kar ajay ga 
        /// in populate function
        //// fetching all the data from user column
        const getAllPost=await postModel.find({}).populate("postedBy","_id name pic").populate("comments.postedBy","_id name pic").sort('-createdAt')
        if(getAllPost){
            return res.status(200).json({message:"All Product Is",getAllPost})
        }else{
            return res.status(400).json({message:"Error In Fetching Posts"})
        }
    }
    catch(err){
        return res.status(500).json({error:err,message:"Internal Server Error"})
    }
}


module.exports.getSubPost=async (req,res)=>{
    try{
        const getAllPost=await postModel.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name pic").populate("comments.postedBy","_id name pic").sort('-createdAt')
        if(getAllPost){
            return res.status(200).json({message:"All Product Is",getAllPost})
        }else{
            return res.status(400).json({message:"Error In Fetching Posts"})
        }
    }
    catch(err){
        return res.status(500).json({error:err,message:"Internal Server Error"})
    }
}



//// Fetch All The Post That User Created It Only Show To The Creator Or LoginUser
module.exports.myPost=async (req,res)=>{
    try{
        /// find function fetching the data according to user id populate function find the user from user document
        /// with the help of posted by we are getting all the post with the req.user._id
        /// with the help of populate we are getting data from the user document
        /// if we do with id then it also will show all the result
        const getAllMyPost=await postModel.find({postedBy:req.user._id}).populate("postedBy","_id name pic")
        // console.log(getAllMyPost)
        return res.status(200).json({message:"The Post Of Creator Is",getAllMyPost})
        // if(getAllMyPost){
        //     return res.status(200).json({message:"All Product Of The Creator",getAllMyPost})
        // }else{
        //     return res.status(400).json({message:"Error In Fetching Posts"})
        // }
    }
    catch(err){
        return res.status(500).json({error:err,message:"Internal Server Error"})
    } console.log(err)
}



//// api for like

module.exports.likePost=async (req,res)=>{

    /// Adding Id in likes by getting from middleware
    /// push will add user
    /// here we not use populate function value come from middleware
    try{
        const response=await postModel.findByIdAndUpdate(req.body.postId,{$push:{likes:req.user._id}},{new:true})
        if(response){
            const {likes}=response
            return res.status(200).json({likes})
        }else{
            return res.status(200).json({error:"Error"})
        }
    }catch(error){
        return res.status(200).json({message:"Internal Server Error",error})
    }
}

/// api for unlike post
module.exports.unLikePost=async (req,res)=>{

    /// Adding Id in unlikes by getting from middleware
    /// pull will remove user
    try{
        const response=await postModel.findByIdAndUpdate(req.body.postId,{$pull:{likes:req.user._id}},{new:true})
        if(response){
            const {likes}=response
            return res.status(200).json({likes})
        }else{
            return res.status(200).json({error:"Error"})
        }
    }catch(error){
        return res.status(200).json({message:"Internal Server Error",error})
    }
}

/// api for comment
module.exports.commentPost=async (req,res)=>{

    /// Adding Id in unlikes by getting from middleware
    /// pull will remove user
    // console.log("posted by Ishmam",req.user._id)
    try{
        const comment={
            text:req.body.text,
            postedBy:req.user._id
        }
        /// we can do with id or postedby id both
        /// fetch on the behalf of postId
        const response=await postModel.findByIdAndUpdate(req.body.postId,{$push:{comments:comment}},{new:true}).populate("comments.postedBy","_id name")
        if(response){
            // console.log(response)
            const {comments}=response
            return res.status(200).json({comments})
        }else{
            return res.status(200).json({error:"Error"})
        }
    }catch(error){
        return res.status(200).json({message:"Internal Server Error",error})
    }
}



/// like post
// module.exports.likePost=async (req,res)=>{

//     /// Adding Id in likes by getting from middleware
//     /// push will add user
//     /// here we not use populate function value come from middleware
//     try{
//         const response=await postModel.findByIdAndUpdate(req.body.postId,{$push:{likes:req.user._id}},{new:true})
//         if(response){
//             const {likes}=response
//             return res.status(200).json({likes})
//         }else{
//             return res.status(200).json({error:"Error"})
//         }
//     }catch(error){
//         return res.status(200).json({message:"Internal Server Error",error})
//     }
// }

/// api for unlike post
// module.exports.unLikePost=async (req,res)=>{

//     /// Adding Id in unlikes by getting from middleware
//     /// pull will remove user
//     try{
//         const response=await postModel.findByIdAndUpdate(req.body.postId,{$pull:{likes:req.user._id}},{new:true})
//         if(response){
//             const {likes}=response
//             return res.status(200).json({likes})
//         }else{
//             return res.status(200).json({error:"Error"})
//         }
//     }catch(error){
//         return res.status(200).json({message:"Internal Server Error",error})
//     }
// }

/// api for deletePost
module.exports.deletePost=async (req,res)=>{
    try{
        // we can add it on _id and on condition base
        const response=await postModel.findOne({_id:req.params.id}).populate("postedBy","_id")
        if(response.postedBy._id.toString() === req.user._id.toString()){
           const result= await response.delete()
           if(result){
               return res.status(200).json(result)
           }else{
               return res.status(200).json({error:"Sorry You Are Not Authorize For Delete Post"})
           }
        }else{
            return res.status(200).json({error:"Error"})
        }
    }catch(error){
        return res.status(200).json({message:"Internal Server Error",error})
    }
}


/// for deleteComment
module.exports.deleteComment=async (req,res)=>{
    try{
        // we can add it on _id and on condition base
        const response=await postModel.findOne({_id:req.params.id}).populate("comments.postedBy","_id")
        console.log(response)
        const result=response.comments
        result.filter((item)=>{
           return item.postedBy._id !=req.user._id
        })
        // res.json(response.comments.filter((item)=>{
        //     return item.postedBy._id
        // }))
        // if(response.comments.postedBy._id.toString() === req.user._id.toString()){
        //    const result= await response.delete()
        //    if(result){
        //        return res.status(200).json(result)
        //    }else{
        //        return res.status(200).json({error:"Sorry You Are Not Authorize For Delete Post"})
        //    }
        // }else{
        //     return res.status(200).json({error:"Error"})
        // }
    }catch(error){
        return res.status(200).json({message:"Internal Server Error",error})
    }
}



// module.exports.deleteComment=async (req,res)=>{

//     /// Adding Id in unlikes by getting from middleware
//     /// pull will remove user
//     // console.log("posted by Ishmam",req.user._id)
//     try{
//         /// we can do with id or postedby id both
//         /// fetch on the behalf of postId
//         const response=await postModel.findByIdAndUpdate({_id:req.params.id},{$pull:{comments:comment}},{new:true}).populate("comments.postedBy","_id name")
//         if(response){
//             // console.log(response)
//             const {comments}=response
//             return res.status(200).json({comments})
//         }else{
//             return res.status(200).json({error:"Error"})
//         }
//     }catch(error){
//         return res.status(200).json({message:"Internal Server Error",error})
//     }
// }