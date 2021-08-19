const router = require('express').Router();
const User = require('../models/User')

//update user
router.put('/:id', async (req, res) => {
  const { id } = req.params.id
  const { userId } = req.body.userId
  console.log(req.user||0)
  res.json('sad')
  // try {
  //   if (id === userId || )
    
  // } catch (err) {
  //   res.status(500).json(err)
  // }

  // try {
  //   const user = await User.findByIdAndUpdate(

  //   )
  // } catch (err) {
  //   res.status(500).json(err)
  // }
})


//delete user
router.put('/:id', async (req, res) => {
  try {


  } catch (err) {
    res.status(500).json(err)
  }
})


//get user
router.put('/:id', async (req, res) => {
  try {


  } catch (err) {
    res.status(500).json(err)
  }
})


//follow user
router.put('/:id', async (req, res) => {
  try {


  } catch (err) {
    res.status(500).json(err)
  }
})


//unfollow user
router.put('/:id', async (req, res) => {
  try {


  } catch (err) {
    res.status(500).json(err)
  }
})
module.exports = router