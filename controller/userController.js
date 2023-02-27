const { User } = require('../model/index')
const { createToken } = require('../utils/jwt')

// 注册
exports.register = async (req, res) => {
  const userModel = new User(req.body)
  const dbBack = await userModel.save()
  const user = dbBack.toJSON()
  // 删除返回值中的password
  delete user.password
  return res.status(201).json({ user })
}

// 登录
exports.login = async (req, res) => {
  let dbBack = await User.findOne(req.body)
  if (!dbBack) {
    return res.status(402).json({ error: '邮箱或者密码不正确' })
  }
  dbBack = dbBack.toJSON()
  dbBack.token = await createToken(dbBack)
  return res.status(201).json(dbBack)
}

// 修改用户
exports.update = async (req, res) => {
  return res.status(200).json({ data: '修改成功' })
}

// 删除用户
exports.deleteUser = async (req, res) => {
  const { userId } = req.params
  const userInfo = await User.findById(userId)
  if (!userInfo) {
    return res.status(404).json({ error: '所删除的用户不存在' })
  }
  const dbBack = await User.deleteOne({ _id: userId })
  if (dbBack.deletedCount > 0) {
    return res.status(200).json({ data: '删除成功' })
  } else {
    return res.status(500).json({ error: '删除失败' })
  }
}

// 获取用户列表
exports.userList = async (req, res) => {
  const dbBack = await User.find()
  return res.status(200).json({ data: dbBack })
}