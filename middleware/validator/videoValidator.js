/**
 * 视频相关校验规则
 */

const { body } = require('express-validator')
const errorBack = require('./errorBack')

// 添加视频
module.exports.addVideo = errorBack([
  body('title')
    .notEmpty().withMessage('视频名称不能为空').bail()
    .isLength({ max: 30 }).withMessage('视频名称不能大于30个字符').bail(),
])