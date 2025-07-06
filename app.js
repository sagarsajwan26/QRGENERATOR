require('dotenv').config()
const express= require('express')
const bodyParser = require('body-parser')
const cors=require('cors')
const db= require('./db')
const app= express()


const userModel= require('./model/User')

const userRouter=require('./routes/UserRoutes')


app.use(bodyParser.json())
app.use(cors({
    origin:process.env.CLIENT_URL
}))



app.use('/userapi',userRouter)



const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log('server started',PORT);
    
})
