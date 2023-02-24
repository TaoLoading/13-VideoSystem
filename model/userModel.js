const mongoose = require('mongoose')
const md5 = require('md5')
const baseModel = require('./baseModel')

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
  // 头像
  image: {
    type: String,
    default: null
  },
  // 频道封面
  cover: {
    type: String,
    default: null
  },
  // 频道描述信息
  description: {
    type: String,
    default: null
  },
  ...baseModel
})

module.exports = userModel