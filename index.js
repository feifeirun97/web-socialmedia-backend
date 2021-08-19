const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const mongoose = require('mongoose')
const userRoute = require("./routers/users")
const authRoute = require("./routers/auth")
//链接Process.env
dotenv.config();

//链接MongoDB Altas
mongoose.connect(
  process.env.MONGO_URL,
  {useNewUrlParser: true, useUnifiedTopology: true},
  ()=>console.log('DB connection success ')
);

//Express
const app = express()
app.use(express.json())           //middleware parser
app.use(helmet())                 //helmet安全链接
app.use(morgan('common'))         //morgan可以展示req具体细节,最后一个数字是duration

app.use("/api/users", userRoute)   //用户查删改
app.use("/api/auth", authRoute)   //注册登陆验证

port = process.env.PORT || 4000

app.listen(port, ()=>console.log(`server run on port ${port}`))