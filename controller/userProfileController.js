const userModel=require('../models/user');
const postModel =require('../models/post');

module.exports.checkProfile=async (req,res)=>{
    try{
        
        const user=await userModel.findOne({_id:req.params.id})
    if(user){
        /// find by id
        const post=await postModel.find({postedBy:req.params.id}).populate("postedBy","_id name")
        if(post){
            return res.status(200).json({user,post})
        }else{
            return res.status(400).json({error:"User Not Found"})
        }
    }else{
        return res.status(400).json({error:"User Not Found"})
    }
    }
    catch(err){
        return res.status(400).json({error:"Internal Server Error"})
    }
}
