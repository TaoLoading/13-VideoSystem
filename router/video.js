const express = require('express')
const multer = require('multer')
const videoController = require('../controller/videoController')
const vodController = require('../controller/vodController')
const videoValidator = require('../middleware/validator/videoValidator')
const { verifyToken } = require('../utils/jwt')

const router = express.Router()

// 配置文件上传的信息
const upload = multer({ dest: 'upload/video/' })

router
  // 获取视频列表
  .get('/getVideoList', videoController.getVideoList)
  // 获取视频详情
  .get('/getVideoDetail/:videoId', verifyToken(false), videoController.getVideoDetail)
  // 获取vod视频上传凭证
  .get('/getVodKey', vodController.getVodKey)
  // 删除视频
  .delete('/:videoId', verifyToken(), videoController.deleteVideo)
  // 上传视频
  .post('/uploadVideo', verifyToken(), upload.single('video'), videoController.uploadVideo)
  // 添加视频
  .post('/addVideo', verifyToken(), videoValidator.addVideo, videoController.addVideo)
  // 评论视频
  .post('/comment/:videoId', verifyToken(), videoController.comment)
  // 获取视频评论
  .get('/getComment/:videoId', videoController.getComment)
  // 删除视频
  .delete('/comment/:commentId', verifyToken(), videoController.deleteComment)
  // 点赞/取消点赞/不喜欢视频
  .post('/likeVideo/:videoId', verifyToken(), videoController.likeVideo)

module.exports = router