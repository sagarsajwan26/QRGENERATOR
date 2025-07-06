const express= require('express')
const {testUser, reguser, loginUser, addLinkqr, getlinks, logoutuser, forgetpass, resetpass, deleteQr, editQr}= require("../controllers/userController")
const router= express.Router()
const uAuth= require('../middleware/userAuthentication')


router.get('/testUser',uAuth, testUser)

router.post('/reguser',reguser)
router.post('/loguser',loginUser)
router.post('/addQrLink',uAuth,addLinkqr )
router.get('/getQrLink',uAuth,getlinks)
router.get('/logoutuser',uAuth,logoutuser)
router.post('/forgetpass',forgetpass)
router.post('/reset-pass/:token',resetpass)
router.get('/deleteqr/:qrid',uAuth, deleteQr)
router.post('/updateqr/:qrid',uAuth,editQr)

module.exports= router