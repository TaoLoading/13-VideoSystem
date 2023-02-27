const fs = require('fs')
const { promisify } = require('util')
const { User } = require('../model/index')
const { createToken } = require('../utils/jwt')

const rename = promisify(fs.rename)

// 注册
exports.register = async (req, res) => {
  const userModel = new User(req.body)
  try {
    const dbBack = await userModel.save()
    const user = dbBack.toJSON()
    // 删除返回值中的password
    delete user.password
    return res.status(201).json({ msg: '注册成功', user })
  } catch (error) {
    return res.status(500).json({ msg: '注册失败', error: error })
  }
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
exports.updateUser = async (req, res) => {
  const id = req.user.userInfo._id
  const dbBack = await User.findByIdAndUpdate(id, req.body, { new: true })
  return res.status(200).json({ data: '修改成功', userInfo: dbBack })
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

// 上传用户头像
exports.uploadAvatar = async (req, res) => {
  const fileInfo = req.file
  /* {
    fieldname: 'avatar',
    originalname: 'avatar.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'upload/img/',
    filename: '915a2a84866cf5a3201de2cbeb3448f9',
    path: 'upload\\915a2a84866cf5a3201de2cbeb3448f9',
    size: 138850
  } */
  // 给文件重命名，加上后缀
  const fileArr = fileInfo.originalname.split('.')
  const fileType = fileArr[fileArr.length - 1]
  try {
    await rename(`./upload/img/${fileInfo.filename}`, `./upload/img/${fileInfo.filename}.${fileType}`)
    return res.status(200).json({ data: '上传成功', filename: `${fileInfo.filename}.${fileType}` })
  } catch (error) {
    return res.status(200).json({ msg: '上传失败', error: error })
  }
}