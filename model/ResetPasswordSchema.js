const mongoose = require('mongoose')

const resetPassSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user_mst",
        required:true
    },
    reset_token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now ,
        expires:3600
    }
})

module.exports= mongoose.model('reset_pass_mst',resetPassSchema)