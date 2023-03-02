const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const videoLikeModel = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  video: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Video'
  },
  isLike: {
    type: Number,
    // 1为点赞，0为取消点赞，-1为不喜欢
    enum: [1, 0, -1],
    required: true
  },
  ...baseModel
})

module.exports = videoLikeModel