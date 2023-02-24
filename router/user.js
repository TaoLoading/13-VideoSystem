const express = require('express')
const userController = require('../controller/userController')
const validator = require('../middleware/validator/userValidator')
const { verifyToken } = require('../utils/jwt')

const router = express.Router()

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

module.exports = router