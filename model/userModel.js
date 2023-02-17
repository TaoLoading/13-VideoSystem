const mongoose = require('mongoose')
const md5 = require('md5')

const userModel = new mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true,
    set: val => md5(val), // 加密
    select: false // 查询时不返回该字段
  },
  phone: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  image: {
    type: String,
    default: null
  },
  createAt: {
    type: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = userModel