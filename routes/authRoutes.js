const {signup,signin,follow,unfollow,updatePic,resetPassword,newPassword,searchUser} = require('../controller/userController');
const router=require('express').Router();
const {requireLogin}=require('../middleware/requireLogin');



router.get('/home',requireLogin,(req,res)=>{
    res.send("Welcome In Home Page")
})
router.post('/signup',signup)
router.post('/signin',signin)
router.put('/follow',requireLogin,follow)
router.put('/updatePic',requireLogin,updatePic)
router.put('/unfollow',requireLogin,unfollow)
router.put('/resetPassword',resetPassword)
router.post('/newPassword',newPassword)
router.post('/searchUser',searchUser)



module.exports=router;