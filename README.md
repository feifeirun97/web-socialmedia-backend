# 安装

```bash
#dotenv链接process.env
#helmet安全链接
#morgan中间件[链接时间，内容]
#nodemon调试
#mongoose链接DB
#bcrypt哈希加密
npm init
yarn add express mongoose dotenv helmet morgan nodemon bcrypt
```

# 安全

+ 存在数据库的密码为hash

  ```js
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  ```

+ API返回不包括密码

  ```js
  const user = await User.findById(id)
  const {password,updatedAt,...other} = user._doc
  res.status(200).json(other)
  ```

# 知识点

+ 对于CRUD，后端不需要考虑id是否存在，需要在前端就规避这种情

# Mongoose

```js
//更新全部
await User.findByIdAndUpdate(id, { $set: req.body })
//更新某列表
await User.findByIdAndUpdate(userFollow, 
        {$push:{followers:userCurrent}}
      )
await User.findByIdAndUpdate(userUnfollow, 
        {$pull:{followers:userCurrent}}
      )
```

**难点**

```js
router.get("/timeline/all", async (req, res) => {
  const userId = req.body.userId
  try {
    const currentUser = await User.findById(userId)
    const userPosts = await Post.find({ userId: userId })
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId })
      })
    )
    //...可以吧列表外壳去掉
    res.status(200).json(userPosts.concat(...friendPosts))

  } catch (err) {
    res.status(500).json("err: " + err)
  }
})
```

