const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt') //JWT

//REGISTER
router.post("/register", async(req,res) => {
  //异步函数必须await才能等到结果
  const {username, email, password} = req.body
  try{
    //JWT
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    //Create new user
    const newUser = await new User({
      username:username,
      email:email,
      password:hashedPassword
    })
    //Save user
    const user = await newUser.save()
    res.status(200).json(user)

  } catch(err){
    res.status(500).json(err)
  }
})

//Login
router.post('/login', async(req, res)=>{
  try{
    //Find user
    const {email, password}=req.body
    const user = await User.findOne({email:email})
    if (!user) { return res.status(404).json('User not found') }
    //Compare psd
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) { return res.status(400).json('Wrong Password') }
    //Respond
    res.status(200).json(user)
  
  } catch(err){
    res.status(500).json(err)
  }
})




module.exports = router