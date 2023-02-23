const { User } = require('../model/index')
const { createToken } = require('../utils/jwt')

// 注册
exports.register = async (req, res) => {
  const userModel = new User(req.body)
  const dbBack = await userModel.save()
  const user = dbBack.toJSON()
  // 删除返回值中的password
  delete user.password
  res.status(201).json({ user })
}

// 登录
exports.login = async (req, res) => {
  // 查询数据库
  let dbBack = await User.findOne(req.body)
  if (!dbBack) {
    return res.status(402).json({ error: '邮箱或者密码不正确' })
  }
  dbBack = dbBack.toJSON()
  dbBack.token = await createToken(req.body)
  res.status(201).json(dbBack)
}

// 获取用户列表
exports.userList = async (req, res) => {
  res.send('/userList')
}

// 删除用户
exports.deleteUser = async (req, res) => {
  res.send('/deleteUser')
}