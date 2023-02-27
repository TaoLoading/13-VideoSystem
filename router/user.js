const express = require('express')
const multer = require('multer')
const userController = require('../controller/userController')
const validator = require('../middleware/validator/userValidator')
const { verifyToken } = require('../utils/jwt')

const router = express.Router()
// 配置文件上传的信息
const upload = multer({ dest: 'uploads/' })

router
  .get('/', (req, res) => {
    res.send('/user')
  })
  // 注册
  .post('/register', validator.register, userController.register)
  // 登录
  .post('/login', validator.login, userController.login)
  // 修改用户
  .put('/', verifyToken, validator.update, userController.update)
  // 删除用户
  .delete('/:userId', userController.deleteUser)
  // 查询用户信息
  .get('/list', verifyToken, userController.userList)
  // 上传用户头像
  .post('/avatar', verifyToken, upload.single('avatar'), userController.avatar)

module.exports = router