const {checkProfile} = require('../controller/userProfileController');
const router=require('express').Router();
const {requireLogin}=require('../middleware/requireLogin');




router.get('/user/:id',checkProfile)



module.exports=router;