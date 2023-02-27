/**
 * 用户相关校验规则
 */

const { body } = require('express-validator')
const errorBack = require('./errorBack')
const { User } = require('../../model')

module.exports.register = errorBack([
  body('username')
    .notEmpty().withMessage('用户名不能为空').bail()
    .isLength({ min: 3 }).withMessage('用户名不能小于3个字符'),
  body('password')
    .notEmpty().withMessage('密码不能为空').bail()
    .isLength({ min: 6 }).withMessage('密码不能小于6个字符'),
  body('phone')
    .notEmpty().withMessage('电话不能为空'),
  body('email')
    .notEmpty().withMessage('邮箱不能为空').bail()
    .isEmail().withMessage('输入的邮箱格式不正确').bail()
    .custom(async val => {
      const emailInDB = await User.findOne({ email: val })
      if (emailInDB) {
        return Promise.reject('当前邮箱已被注册')
      }
    }).bail()
])

module.exports.login = errorBack([
  body('password')
    .notEmpty().withMessage('密码不能为空').bail(),
  body('email')
    .notEmpty().withMessage('邮箱不能为空').bail()
    .isEmail().withMessage('输入的邮箱格式不正确')
    .custom(async val => {
      const emailValidate = await User.findOne({ email: val })
      if (!emailValidate) {
        return Promise.reject('当前邮箱未注册')
      }
    }).bail()
])

module.exports.update = errorBack([
  body('email')
    .custom(async val => {
      const emailValidate = await User.findOne({ email: val })
      if (emailValidate) {
        return Promise.reject('邮箱已经被注册')
      }
    }).bail(),
  body('username')
    .custom(async val => {
      const nameValidate = await User.findOne({ username: val })
      if (nameValidate) {
        return Promise.reject('用户已经被注册')
      }
    }).bail(),
  body('phone')
    .custom(async val => {
      const phoneValidate = await User.findOne({ phone: val })
      if (phoneValidate) {
        return Promise.reject('手机已经被注册')
      }
    }).bail()
])