const mongoose = require('mongoose')
const userModel = require('./userModel')
const { mongoPath } = require('../config/config.default')

const main = async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(mongoPath)
}

main()
  .then(res => {
    console.log('连接成功')
  })
  .catch(err => {
    console.log('连接失败，原因是：', err)
  })

// 导出模型
module.exports = {
  User: mongoose.model('User', userModel)
}