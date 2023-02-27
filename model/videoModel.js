const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const videoModel = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  vodVideoId: {
    type: String,
    required: false
  },
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User' // 与userModel进行关联
  },
  cover: {
    type: String,
    required: false
  },
  commentCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  dislikeCount: {
    type: Number,
    default: 0
  },
  ...baseModel
})

module.exports = videoModel