const jwt=require("jsonwebtoken");
const userModel=require('../models/user');


module.exports.requireLogin=(req,res,next)=>{
    const {authorization} =req.headers
    if(!authorization){
        return res.status(401).json({error:"You Must Be Logedin"})
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,process.env.scret,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You Must Be Logged In"})
        }
        const {_id}=payload;
        userModel.findById({_id}).then((userdata)=>{
            // req.user=userdata
            req.user=userdata
            next()
        })
        
    })
}