require('dotenv').config()
const express= require('express')
const bodyParser = require('body-parser')
const cors=require('cors')
const db= require('../db')
const serverless= require('serverless-http')
const app= express()



const userRouter=require('../routes/UserRoutes')


app.use(bodyParser.json())
app.use(cors({
    origin:process.env.CLIENT_URL
}))



app.use('/userapi',userRouter)

module.exports= app

module.exports.handler = serverless(app)
