const userModel=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const nodemailer = require("nodemailer");
/// in build crypto model in nodejs
const crypto = require('crypto');





module.exports.signup=async (req,res)=>{
    const {name,email,password,pic}=req.body;
    if(!name || !email || !password){
        return res.status(400).json({error:"Please Add All The Fields"})
    }
    const checkEmail=await userModel.findOne({email})
    if(checkEmail){
        return res.status(403).json({error:"User Already Exist"})
    }else{
        const hashPassword=await bcrypt.hash(password,10)
       try{
        const saveuser=await userModel.create({name,email,password:hashPassword,pic})
        if(saveuser){
            let info = await transporter.sendMail({
                from: 'ishmamalikhan@gmail.com', // sender address
                to: "ishmamali2200@gmail.com", // list of receivers
                subject: "Signup Successfully ✔", // Subject line
                // text: "Hello world?", // plain text body
                html: "<b>Welcome You Signup Successfully?</b>", // html body
              });
              if(info){
                return res.status(200).json({message:"SignUp Successfully",saveuser})
              }else{
                return res.status(400).json({message:"Sorry Something Went Wrong",saveuser})   
              }
        }
        else{
            return res.status(400).json({message:"Sorry Something Went Wrong",saveuser})  
        }
       }catch(err){
        return res.status(400).json({error:err})
       }
    }
}


module.exports.resetPassword=async(req,res)=>{
    crypto.randomBytes(32,async (err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        const result =await userModel.findOne({email:req.body.email})
        if(result){
            userModel.resetToken =token;
            /// valid only for 5 minutes
            userModel.expireToken = Date.now() +5*60*1000
            let info = await transporter.sendMail({
                from: 'ishmamali2200@gmail.com', // sender address
                to: result.email, // list of receivers
                subject: "Reset Password", // Subject line
                // text: "Hello world?", // plain text body
                html: `<p>Your Requested For Reset Password</P>
                <h5>Click In This <a href="http://localhost:3000/reset/${token}">Link</a> To Reset Password</h5>
                `, // html body
              });
              if(info){
                  return res.json({message:"Check Your Email"})
              }
            //// 30000
        }else{
            return res.status(400).json({message:"User Don't Exist With This Email"})
        }
    })
}


module.exports.newPassword=async(req,res)=>{
    const newPassword =req.body.password;
    const sendToken =req.body.token;
    const result=await userModel.findOne({resetToken:sendToken,expireToken:{$gt:Date.now()}})
    if(result){
        return res.status(422).json({error:"Try Again Session Expired"})
    }
    const hsh=await bcrypt.hash(newPassword,10)
    if(hsh){
        const rslt=userModel.create({password:newPassword})
        if(rslt){
            return res.status(200).json({message:"Password Updated Successfully"})
        }
    }
    else{
        return res.status(200).json({message:"Error"})
    }
}

module.exports.searchUser=async(req,res)=>{
    let userPattern = new RegExp('^'+req.body.query)
    const record=await userModel.find({email:{$regex:userPattern}}).select("_id email")
    if(record){
        return res.status(200).json({record})
    }else{
        return res.status(400).json({error:"No Data Found"})
    }
}






module.exports.signin=async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
       return res.status(422).json({error:"Please Add Email Or Password"})
    }else{
        try{
            const user=await userModel.findOne({email})
            if(user){
                const checkUser=await bcrypt.compare(password,user.password)
                if(checkUser){
                    user.password=undefined;
                    const token=jwt.sign({_id:user._id},process.env.scret)
                    return res.status(200).json({message:"Signin Successfully",token,user})
                }else{
                    return res.status(400).json({error:"Invalid Email/Password"})
                }
            }else{
                return res.status(400).json({error:"Invalid Email/Password"}) 
            }
        }catch(error){
            return res.status(400).json({error:error})
        }
    }

}


module.exports.updatePic=async (req,res)=>{
    try{
        const result=await userModel.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true})
        console.log("The Value Of Result Is",result)
    if(result){
        return res.status(200).json({result})
    }else{
        return res.status(400).json({message:"Pic Cannot Update"})
    }
    }
    catch(error){
        return res.status(500).json({message:"Internal Server Error"})
    }

}



/// api for follow user


module.exports.follow=async(req,res)=>{
        try{
            const response=await userModel.findByIdAndUpdate(req.body.followId,{$push:{followers:req.user._id}},{new:true}).select('-password')
            if(response){
                const resp=await userModel.findByIdAndUpdate(req.user._id,{$push:{following:req.body.followId}},{new:true}).select('-password')
                // console.log("The Value Of Response Is in follow",resp)
                if(resp){
                    // console.log("The Value Of Response Is",res)
                    return res.status(200).json({resp})
                    
                }
                else{
                    return res.status(400).json({error:"Oh! Failed"})
                }
            }else{
                return res.status(400).json({error:"Oh! Failed"})
            }
        }catch(error){
            return res.status(400).json({error:error,message:"Internal Server Error"})
        }

}


/// unfollow user

module.exports.unfollow=async (req,res)=>{
    try{
        const response=await userModel.findByIdAndUpdate(req.body.unfollowId,{$pull:{followers:req.user._id}},{new:true})
        if(response){
            const resp=await userModel.findByIdAndUpdate(req.user._id,{$pull:{following:req.body.unfollowId}},{new:true})
            // console.log("The Value Of Response Is in unfollow",resp)
            if(resp){
                return res.status(200).json({resp})
            }
            else{
                return res.status(400).json({error:"Oh! Failed"})
            }
        }else{
            return res.status(400).json({error:"Oh! Failed"})
        }
    }catch(error){
        return res.status(400).json({error:error,message:"Internal Server Error"})
    }

}