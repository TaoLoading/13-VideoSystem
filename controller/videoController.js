const fs = require('fs')
const { promisify } = require('util')
const { Video } = require('../model/index')

const rename = promisify(fs.rename)

// 获取视频列表
exports.videoList = async (req, res) => {
  res.send('/videoList')
}

// 删除视频
exports.deleteVideo = async (req, res) => {
  res.send('/deleteVideo')
}

// 添加视频
exports.addVideo = async (req, res) => {
  let body = req.body
  body.user = req.user.userInfo._id
  const videoModel = new Video(req.body)
  try {
    const dbBack = await videoModel.save()
    return res.status(201).json({ msg: '添加成功', dbBack })
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
  } catch (error) {
    return res.status(500).json({ msg: '上传失败', error: error })
  }
  return res.status(200).json({ data: '上传成功', filename: `${fileInfo.filename}.${fileType}` })
}