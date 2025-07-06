const mongoose= require('mongoose')
const TokenBlackListSchema= new mongoose.Schema({

  token:{
    type:String,
    required:true
  }

})

module.exports= mongoose.model('blacklistToken_mst',TokenBlackListSchema)