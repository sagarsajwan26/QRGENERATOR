require("dotenv").config()
const mongoose = require('mongoose')


mongoose.connect(process.env.DB_URL)

mongoose.connection.on('connected',()=>{
    console.log('MONGO DB CONNECTED');
    
})

mongoose.connection.on('error',(error)=>{
    console.log('error on mongo db connected',error);
    
})


module.exports= mongoose