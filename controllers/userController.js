require('dotenv').config()
const userModel = require('../model/User')
const LinkQRmodel= require('../model/LinkQr')
const ResetPassModel= require('../model/ResetPasswordSchema')
const bcrypt = require("bcryptjs")
const jwt= require("jsonwebtoken")
const tokenBlackListModel = require('../model/tokenBlackList')
const nodemailer= require('nodemailer')
const crypto = require('crypto')
// const transporter= nodemailer.createTransport({
//     'service':"gmail",
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASS
//     }
// })


exports.testUser= async(req,res)=>{
    return res.json({
        msg:"text user"
    })
}


exports.reguser= async(req,res)=>{
const uname= req.body.uname 
const uemail= req.body.email 
const upass= await bcrypt.hash(req.body.pass,10)

try {
    const newUser= new userModel({
        "user_name":uname,
        "user_pass":upass,
        "user_email":uemail
    })

const saveUser=await newUser.save()
res.json({saveUser})
} catch (error) {
    res.json({'error':error})
}
}



exports.loginUser=async(req,res)=>{
    const uemail = req.body.uemail 
    const upass= req.body.upass

    try {
        const userLogin = await userModel.findOne({"user_email":uemail})

        if(!userLogin){
            res.json({"loginsts":"1","msg":"user not found"})
        }
        else{
            const isMatch= await bcrypt.compare(upass,userLogin.user_pass)
            if(!isMatch) {
                res.json({"loginsts":"2",
                "msg":"password you entered is wrong"
            }) 
            }else{
                const token = jwt.sign({
                    id:userLogin._id,
                    user_email:userLogin.user_email
                },
            process.env.JWT_USER_SECRET,{expiresIn:'1h'})
            
            res.json({"loginsts":"0", "token":token})
        }


        }




    } catch (error) {
        console.log(error);
        
    }

}


exports.addLinkqr= async(req,res)=>{
    const {qrlink,qrcolor}= req.body
    const user= req.user.id
    console.log('hi');
    
    
    
    
    try {
    
        const newLinkQr= new LinkQRmodel({
            qrlink,
            qrcolor,
            user
        })
        
        
        const saveQR= await newLinkQr.save()

        res.json({msg:"successfully added qr",saveQR})

    } catch (error) {
        res.json({"error":error})
    }
}

exports.getlinks= async(req,res)=>{
     try {
        const qrlinks= await LinkQRmodel.find({user:req.user.id})
        res.json({qrlinks})




     } catch (error) {
        res.json("error",error)
     }
}


exports.logoutuser= async(req,res)=>{
    const token = req.headers.authorization?.split(' ')[1]
    if(!token) return res.json({"msg":"no token found"})

        try {
            const tokenData= new tokenBlackListModel({
                token
            })

                const saveBlcToken=await tokenData.save()
                res.json(saveBlcToken)


        } catch (error) {
            console.log(error);
            
        }
}

exports.forgetpass=async(req,res)=>{
    const user_email= req.body.email 
    try {
        const user= await userModel.findOne({user_email})
        if(!user) return res.json({"msg":"user not found"})
            const token= crypto.randomBytes(32).toString('hex')
       
       await ResetPassModel.deleteMany({userId:user._id})
      const newReset= await new ResetPassModel({
        userId:user._id,
        reset_token:token
      })
      await newReset.save()

      const resetUrl= `${process.env.CLIENT_URL}/reset-password/${token}`
    //   await transporter.sendMail({
    //     to:user.user_email,
    //     subject:"qr gemeratpr forget password link",
    //     html:`
    //     <h1>click link below to reset password </h1>
    //     <a href="${resetUrl}" >${resetUrl} </>
    //     `
    //   })
      res.json({"msg":"reset password link has been send  to you account","reset_link":resetUrl})
        
    } catch (error) {
        console.log("error",error);
        
    }


}

exports.resetpass=async(req,res)=>{
    const { token} = req.params 
    const user_pass= req.body.password 
    try {
        const resetToken= await ResetPassModel.findOne({"reset_token":token})
        if(!resetToken) {
            return res.json({ 
                "resetsts":"1",
                "msg":"invalid or expired Link"})
          
        }
        const upass= await bcrypt.hash(user_pass,10)
          const resetPass= await userModel.findOneAndUpdate({_id:resetToken.userId},{
            $set:{
                user_pass:upass
            }
          },{
            new:true
          })

          await ResetPassModel.deleteMany({"reset_token":token})


          res.json({"resetsts":"0","msg":"your password has been reset successfully"})

    } catch (error) {
        res.json('error',error)
    }

}

exports.deleteQr=async(req,res)=>{
    const {qrid} = req.params 
    try {
        const deleteQr= await LinkQRmodel.findByIdAndDelete(qrid)
        if(deleteQr) {
            res.json({"deletedsts":"0","msg":"qr has been deleted successfully"})
        } else{
            res.json({"deletedsts":"1","msg":"qr has been not been deleted"})
        }
    } catch (error) {
        console.log(error);
        
    }
}


exports.editQr= async(req,res)=>{
const {qrid}= req.params 
const {qrlink,qrcolor}= req.body

try {
    const updateQr= await LinkQRmodel.findByIdAndUpdate(qrid,{
        qrlink,
        qrcolor
    },{
        new:true
    })
    res.json({updateQr})
} catch (error) {
    console.log(error);
    
}
}