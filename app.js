require('dotenv').config()
const express=require('express');
const app=express();
const port=1200;
const mongoose=require('mongoose');
const userRouter=require('./routes/authRoutes');
const postRouter=require('./routes/postRoute');
const user=require('./routes/user');


mongoose.connect(process.env.URL).then(()=>{
    console.log("Database Connected Successfully")
}).catch((err)=>{
    console.log("Database Failed To Connect")
})

/// global middleware
/// asa middleware jo tmam fucntion ky lay run hotta ha
app.use(express.json());
app.use('/api',userRouter);
app.use('/api',postRouter);
app.use('/api',user);




app.listen(port,()=>{
    console.log(`Server Is Running On port ${port}`)
})


