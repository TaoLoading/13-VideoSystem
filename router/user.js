const express = require('express')
const userController = require('../controller/userController')
const validator = require('../middleware/validator/userValidator')

const router = express.Router()

router
  .get('/', (req, res) => {
    res.send('/user')
  })
  .post('/register', validator.register, userController.register)
  .get('/lists', userController.userList)
  .delete('/', userController.deleteUser)

module.exports = router