const mongoose = require('mongoose')
const userModel = require('./userModel')
const { mongoPath } = require('../config/config.default')

const main = async () => {
  mongoose.set('strictQuery', false)
  try {
    await mongoose.connect(mongoPath)
  } catch (error) {
    console.log('连接失败，原因是：', error)
  }
  console.log('连接成功')
}
main()

// 导出模型
module.exports = {
  User: mongoose.model('User', userModel)
}