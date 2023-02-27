const fs = require('fs')
const { promisify } = require('util')

const rename = promisify(fs.rename)

// 获取视频列表
exports.videoList = async (req, res) => {
  res.send('/videoList')
}

// 删除视频
exports.deleteVideo = async (req, res) => {
  res.send('/deleteVideo')
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
    return res.status(200).json({ msg: '上传失败', error: error })
  }
  return res.status(200).json({ data: '上传成功', filename: `${fileInfo.filename}.${fileType}` })
}