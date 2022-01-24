const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        uppercase: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:{
        type:String,
    },
    expireToken:Date,
    pic:{
        type:String,
        default:'https://res.cloudinary.com/ishmam/image/upload/v1642851582/download_s41j53.png'
    },
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],
    following:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],
})


module.exports=mongoose.model("user",userSchema)