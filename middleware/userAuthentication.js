require('dotenv').config()
const jwt = require('jsonwebtoken')
const tokenBlackList = require('../model/tokenBlackList')



const userAuthentication =async(req,res,next)=>{
    
    const header= req.header("Authorization")
    if(!header || !header.startsWith('Bearer ') ){
        res.json({"token_sts":"1","msg":"no token found or invalid"})
      
      
    }else{
        const token = header.split(' ')[1]

        const isBlackList= await tokenBlackList.findOne({token})
        if(isBlackList) return  res.json({"token_sts":"3","msg":"token is invalid"})
        
        try {
            const verified= jwt.verify(token,process.env.JWT_USER_SECRET)
         

            req.user= verified
           
            next()
        } catch (error) {
            res.json({"token_sts":"2","msg":error})
        }
    }
}

module.exports= userAuthentication