const {createPost,viewPost,myPost,likePost,unLikePost,commentPost,deletePost,deleteComment,getSubPost} = require('../controller/postController');
const {requireLogin}=require('../middleware/requireLogin')

const router=require('express').Router()







router.post('/createPost',requireLogin,createPost)
router.get('/viewPost',requireLogin,viewPost)
router.get('/getsubpost',requireLogin,getSubPost)
router.get('/myPost',requireLogin,myPost)
router.put('/likePost',requireLogin,likePost)
router.put('/unlikePost',requireLogin,unLikePost)
router.put('/comment',requireLogin,commentPost)
router.delete('/deletePost/:id',requireLogin,deletePost)
router.delete('/deleteComment/:id',requireLogin,deleteComment)








module.exports=router;