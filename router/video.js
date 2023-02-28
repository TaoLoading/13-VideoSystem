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
  .get('/getVideoDetail/:videoId', videoController.getVideoDetail)
  // 获取vod视频上传凭证
  .get('/getVodKey', vodController.getVodKey)
  // 删除视频
  .delete('/', videoController.deleteVideo)
  // 上传视频
  .post('/uploadVideo', verifyToken, upload.single('video'), videoController.uploadVideo)
  // 添加视频
  .post('/addVideo', verifyToken, videoValidator.addVideo, videoController.addVideo)

module.exports = router