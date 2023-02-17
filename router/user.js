const express = require('express')
const userController = require('../controller/userController')
const validator = require('../middleware/validator/userValidator')
const { verifyToken } = require('../utils/jwt')

const router = express.Router()

router
  .get('/', (req, res) => {
    res.send('/user')
  })
  .post('/register', validator.register, userController.register)
  .post('/login', validator.login, userController.login)
  .get('/list', verifyToken, userController.userList)
  .delete('/', userController.deleteUser)

module.exports = router