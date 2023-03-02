const fs = require('fs')
const { promisify } = require('util')
const { Video, Comment } = require('../model/index')

const rename = promisify(fs.rename)

// 获取视频列表
exports.getVideoList = async (req, res) => {
  const { pageNum = 1, pageSize = 10 } = req.query
  try {
    const list = await Video.find()
      .skip((pageNum - 1) * pageSize) // 分页
      .limit(pageSize) // 分页
      .sort({ createAt: -1 }) // 按创建时间倒序排列
      .populate('user', '_id username cover image') // 关联用户信息查询
    const total = await Video.countDocuments()
    res.status(200).json({ list, total: total })
  } catch (error) {
    return res.status(500).json({ msg: '查询失败', error: error })
  }
}

// 获取视频详情
exports.getVideoDetail = async (req, res) => {
  const { videoId } = req.params
  try {
    const videoInfo = await Video.findById(videoId)
      .populate('user', '_id username cover image')
    res.status(200).json(videoInfo)
  } catch (error) {
    return res.status(500).json({ msg: '查询失败', error: error })
  }
}

// 删除视频
exports.deleteVideo = async (req, res) => {
  const { videoId } = req.params
  try {
    const videoInfo = await Video.findById(videoId)
    if (!videoInfo) {
      return res.status(404).json({ error: '所删除的视频不存在' })
    }
    const dbBack = await Video.deleteOne({ _id: videoId })
    if (dbBack.deletedCount > 0) {
      return res.status(200).json({ data: '删除成功' })
    } else {
      return res.status(404).json({ error: '删除失败' })
    }
  } catch (error) {
    return res.status(500).json({ msg: '删除失败', error: error })
  }
}

// 添加视频
exports.addVideo = async (req, res) => {
  let body = req.body
  body.user = req.user.userInfo._id
  const videoModel = new Video(req.body)
  try {
    const dbBack = await videoModel.save()
    return res.status(200).json({ msg: '添加成功', dbBack })
  } catch (error) {
    return res.status(500).json({ msg: '添加失败', error: error })
  }
}

// 上传视频
exports.uploadVideo = async (req, res) => {
  const fileInfo = req.file
  // 给文件重命名，加上后缀
  const fileArr = fileInfo.originalname.split('.')
  const fileType = fileArr[fileArr.length - 1]
  try {
    await rename(`./upload/video/${fileInfo.filename}`, `./upload/video/${fileInfo.filename}.${fileType}`)
    return res.status(200).json({ data: '上传成功', filename: `${fileInfo.filename}.${fileType}` })
  } catch (error) {
    return res.status(500).json({ msg: '上传失败', error: error })
  }
}

// 评论视频
exports.comment = async (req, res) => {
  const { videoId } = req.params
  try {
    const video = await Video.findById(videoId)
    if (video) {
      const { content } = req.body
      // 保存评论
      await new Comment({
        content: content,
        video: videoId,
        user: req.user.userInfo._id
      }).save()
      // 评论数+1
      video.commentCount++
      await video.save()
      return res.status(200).json({ msg: '评论成功' })
    } else {
      return res.status(404).json({ msg: '评论失败', error: '当前视频不存在' })
    }
  } catch (error) {
    return res.status(500).json({ msg: '评论失败', error: error })
  }
}

// 获取视频评论
exports.getComment = async (req, res) => {
  const { videoId } = req.params
  const { pageNum = 1, pageSize = 10 } = req.body
  try {
    const comments = await Comment
      .find({ video: videoId })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate('user', '_id username cover image')
    const total = await Comment.countDocuments({ video: videoId })
    return res.status(200).json({ comments, total: total })
  } catch (error) {
    return res.status(500).json({ msg: '查询失败', error: error })
  }
}

// 删除视频
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params
  const userId = req.user.userInfo._id
  console.log('commentId', commentId)
  console.log('userId', userId)

  try {
    const commentInfo = await Comment.findById(commentId)
    const videoId = commentInfo.video
    const videoInfo = await Video.findById(videoId)

    if (!commentInfo) {
      return res.status(404).json({ msg: '删除失败', error: '当前评论不存在' })
    }

    // 判断当前评论是由该用户发出
    if (!commentInfo.user.equals(userId)) {
      // 判断当前评论是否属于该用户的视频
      if (!videoInfo.user.equals(userId)) {
        return res.status(403).json({ msg: '删除失败', error: '无删除权限' })
      }
    }

    await commentInfo.remove()
    videoInfo.commentCount--
    await videoInfo.save()
    return res.status(200).json({ msg: '删除成功' })
  } catch (error) {
    return res.status(500).json({ msg: '删除失败', error: error })
  }
}