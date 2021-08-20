const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//默认给的id必然存在

//create post
router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body)
    const postSaved = await post.save()
    res.status(200).json(postSaved)
  } catch (err) {
    res.status(500).json("err: " + err)
  }
})

//update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body })
      res.status(200).json("The post has been updated.")
    } else {
      res.status(403).json("You can only update your post")
    }
  } catch (err) {
    res.status(500).json("err: " + err)
  }
})

//delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
      await post.deleteOne({ $set: req.body })
      res.status(200).json("The post has been deleted.")
    } else {
      res.status(403).json("You can only delete your post")
    }
  } catch (err) {
    res.status(500).json("err: " + err)
  }
})


//like and dislike post
router.put("/:id/like", async (req, res) => {
  const postId = req.params.id
  const userId = req.body.userId
  try {
    const post = await Post.findById(postId)
    if (!post.likes.includes(userId)) {
      //未赞
      await post.updateOne({ $push: { likes: userId } })
      res.status(200).json("The post has been liked.")
    } else {
      //已赞
      await post.updateOne({ $pull: { likes: userId } })
      res.status(403).json("The post has been disliked.")
    }
  } catch (err) {
    res.status(500).json("err: " + err)
  }
})

//get post
router.get("/:id", async (req, res) => {
  const postId = req.params.id
  try {
    const post = await Post.findById(postId)
    res.status(200).json(post)

  } catch (err) {
    res.status(500).json("err: " + err)
  }
})


//get timeline posts
//难点：返回自己的posts和关注用户的posts
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




module.exports = router