const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt') //JWT

//update user
//req:{userId,others}
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { userId, password, isAdmin } = req.body
  //id相同或者是管理员身份才能修改
  if (id === userId || isAdmin) {
    //修改密码重新生成
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(password, salt)
      } catch (err) {
        return res.status(500).json('err:' + err)
      }
    }
    //其余直接修改
    try {
      await User.findByIdAndUpdate(id, { $set: req.body })
      res.status(200).json("Account updated")
    } catch (err) {
      return res.status(500).json('err:' + err)
    }

  } else {
    res.status(403).json("You can update only your account!")
  }
})


//delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { userId, isAdmin } = req.body
  //id相同或者是管理员身份才能修改
  if (id === userId || isAdmin) {
    //其余直接修改
    try {
      await User.findByIdAndDelete(id)
      res.status(200).json("Account deleted")
    } catch (err) {
      return res.status(500).json('err:' + err)
    }

  } else {
    res.status(403).json("You can delete only your account!")
  }
})


//get user
router.get('/:id', async (req, res) => {
  const { id } =req.params
  try {
    const user = await User.findById(id)
    //不显示密码和修改日期
    const {password,updatedAt,...other} = user._doc
    res.status(200).json(other)

  } catch (err) {
    res.status(500).json(err)
  }
})


//follow user
router.put('/:id/follow', async (req, res) => {
  //id是要关注的用户userId是当前操作用护
  const userCurrent = req.body.userId
  const userFollow = req.params.id
  
  if (userCurrent !== userFollow) {
    User.findByIdAndUpdate(userFollow, {$push:{followers:userCurrent}})//更新关注的用户的follower列表

    try {
      await User.findByIdAndUpdate(userCurrent, 
        {$push:{followings:userFollow}}
        )//更新操作用户的following列表

      await User.findByIdAndUpdate(userFollow, 
        {$push:{followers:userCurrent}}
      )//更新关注的用户的follower列表

      res.status(200).json("User has been followed")
    } catch (err) {
      return res.status(500).json('err:' + err)
    }

  } else {
    res.status(403).json("You cant follow yourself")
  }
})


//unfollow user
router.put('/:id/unfollow', async (req, res) => {
  //id是要关注的用户userId是当前操作用护
  const userCurrent = req.body.userId
  const userUnfollow = req.params.id
  
  if (userCurrent !== userUnfollow) {
    try {
      await User.findByIdAndUpdate(userCurrent, 
        {$pull:{followings:userUnfollow}} 
        )//更新操作用户的following列表

      await User.findByIdAndUpdate(userUnfollow, 
        {$pull:{followers:userCurrent}}
      )//更新关注的用户的follower列表

      res.status(200).json("Unfollowed success")
    } catch (err) {
      return res.status(500).json('err:' + err)
    }

  } else {
    res.status(403).json("You cant unfollow yourself")
  }
})

module.exports = router