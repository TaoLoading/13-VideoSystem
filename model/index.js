const mongoose = require('mongoose')
const { mongoPath } = require('../config/config.default')
const userModel = require('./userModel')
const videoModel = require('./videoModel')
const subscribeModel = require('./subscribeModel')
const commentModel = require('./commentModel')
const videoLikeModel = require('./videoLikeModel')

const main = async () => {
  mongoose.set('strictQuery', false)
  try {
    await mongoose.connect(mongoPath)
    console.log('连接成功')
  } catch (error) {
    console.log('连接失败，原因是：', error)
  }
}
main()

// 导出模型
module.exports = {
  User: mongoose.model('User', userModel),
  Video: mongoose.model('Video', videoModel),
  Subscribe: mongoose.model('Subscribe', subscribeModel),
  Comment: mongoose.model('Comment', commentModel),
  VideoLike: mongoose.model('VideoLike', videoLikeModel),
}