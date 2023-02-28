const express = require('express')
const multer = require('multer')
const userController = require('../controller/userController')
const userValidator = require('../middleware/validator/userValidator')
const { verifyToken } = require('../utils/jwt')

const router = express.Router()

// 配置文件上传的信息
const upload = multer({ dest: 'upload/img/' })

router
  // 注册
  .post('/register', userValidator.register, userController.register)
  // 登录
  .post('/login', userValidator.login, userController.login)
  // 修改用户
  .put('/', verifyToken(), userValidator.updateUser, userController.updateUser)
  // 删除用户
  .delete('/:userId', userController.deleteUser)
  // 查询用户信息
  .get('/getUserList', verifyToken(), userController.getUserList)
  // 上传用户头像
  .post('/uploadAvatar', verifyToken(), upload.single('avatar'), userController.uploadAvatar)

module.exports = router