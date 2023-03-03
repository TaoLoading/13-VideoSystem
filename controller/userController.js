const fs = require('fs')
const { promisify } = require('util')
const lodash = require('lodash')
const { User, Subscribe } = require('../model/index')
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
  try {
    let loginInfo = await User.findOne(req.body)
    if (!loginInfo) {
      return res.status(401).json({ error: '邮箱或者密码不正确' })
    }
    loginInfo = loginInfo.toJSON()
    loginInfo.token = await createToken(loginInfo)
    return res.status(200).json({ msg: '登录成功', loginInfo })
  } catch (error) {
    return res.status(500).json({ msg: '登录失败', error: error })
  }
}

// 修改用户
exports.updateUser = async (req, res) => {
  const id = req.user.userInfo._id
  try {
    const userInfo = await User.findByIdAndUpdate(id, req.body, { new: true })
    return res.status(201).json({ data: '修改成功', userInfo: userInfo })
  } catch (error) {
    return res.status(500).json({ msg: '修改失败', error: error })
  }
}

// 删除用户
exports.deleteUser = async (req, res) => {
  const { userId } = req.params
  try {
    const userInfo = await User.findById(userId)
    if (!userInfo) {
      return res.status(404).json({ error: '所删除的用户不存在' })
    }
    const dbBack = await User.deleteOne({ _id: userId })
    if (dbBack.deletedCount > 0) {
      return res.status(200).json({ data: '删除成功' })
    } else {
      return res.status(404).json({ error: '删除失败' })
    }
  } catch (error) {
    return res.status(500).json({ msg: '删除失败', error: error })
  }
}

// 获取用户列表
exports.getUserList = async (req, res) => {
  const { pageNum = 1, pageSize = 10 } = req.query
  try {
    const list = await User.find()
      .skip((pageNum - 1) * pageSize).limit(pageSize) // 分页
      .sort({ createAt: -1 }) // 按创建时间倒序排列
    const total = await User.countDocuments()
    res.status(200).json({ list, total: total })
  } catch (error) {
    return res.status(500).json({ msg: '查询失败', error: error })
  }
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
    return res.status(201).json({ data: '上传成功', filename: `${fileInfo.filename}.${fileType}` })
  } catch (error) {
    return res.status(500).json({ msg: '上传失败', error: error })
  }
}

// 订阅
exports.subscribe = async (req, res) => {
  const userId = req.user.userInfo._id
  // 被订阅者id
  const subscriberId = req.params.subscriberId

  // 禁止订阅自己
  if (userId === subscriberId) {
    return res.status(403).json({ msg: '订阅失败', error: '不可订阅自己的频道' })
  }

  try {
    // 查看是否订阅
    const record = await Subscribe.findOne({
      user: userId,
      subscriber: subscriberId
    })
    if (!record) {
      // 保存订阅记录
      await new Subscribe({
        user: userId,
        subscriber: subscriberId
      }).save()

      // 订阅者订阅数+1
      const user = await User.findById(userId)
      user.subscribeCount++
      await user.save()

      // 被订阅者粉丝数+1
      const subscriber = await User.findById(subscriberId)
      subscriber.fansCount++
      await subscriber.save()

      return res.status(200).json({ msg: '订阅成功' })
    } else {
      return res.status(403).json({ msg: '订阅失败', error: '已经订阅过当前频道' })
    }
  } catch (error) {
    return res.status(500).json({ msg: '订阅失败', error: error })
  }
}

// 取消订阅
exports.unsubscribe = async (req, res) => {
  const userId = req.user.userInfo._id
  // 被取消订阅者id
  const subscriberId = req.params.subscriberId

  // 禁止取消订阅自己
  if (userId === subscriberId) {
    return res.status(403).json({ msg: '订阅失败', error: '不可订阅自己的频道' })
  }

  try {
    // 查看是否订阅
    const record = await Subscribe.findOne({
      user: userId,
      subscriber: subscriberId
    })
    if (record) {
      // 删除订阅记录
      await record.remove()

      // 订阅者订阅数-1
      const user = await User.findById(userId)
      user.subscribeCount--
      await user.save()

      // 被订阅者粉丝数-1
      const subscriber = await User.findById(subscriberId)
      subscriber.fansCount--
      await subscriber.save()

      return res.status(200).json({ msg: '取消订阅成功' })
    } else {
      return res.status(403).json({ msg: '取消订阅失败', error: '未订阅当前频道' })
    }
  } catch (error) {
    return res.status(500).json({ msg: '取消订阅失败', error: error })
  }
}

// 查看频道信息
exports.getChannel = async (req, res) => {
  let isSubscribed = false
  const channelId = req.params.channelId
  try {
    if (req.user) {
      const userId = req.user.userInfo._id
      // 查询当前登录的用户是否订阅该频道
      const record = await Subscribe.findOne({
        user: userId,
        subscriber: channelId
      })
      if (record) {
        isSubscribed = true
      }
    }

    let channelInfo = await User.findById(channelId)
    channelInfo = lodash.pick(channelInfo, [
      '_id',
      'username',
      'image',
      'cover',
      'description',
      'subscribeCount',
      'fansCount'
    ])
    return res.status(200).json({
      ...channelInfo,
      isSubscribed: isSubscribed
    })
  } catch (error) {
    return res.status(500).json({ msg: '查询失败', error: error })
  }
}

// 获取订阅列表
exports.getSubscribeList = async (req, res) => {
  const userId = req.params.userId
  const { pageNum = 1, pageSize = 10 } = req.query
  try {
    let subscribeList = await Subscribe
      .find({
        user: userId
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate('subscriber')
    subscribeList = subscribeList.map(item => {
      // 筛选被订阅频道的信息
      return lodash.pick(item.subscriber, [
        '_id',
        'username',
        'image',
        'cover',
        'description',
        'subscribeCount',
        'fansCount'
      ])
    })
    return res.status(200).json({ msg: '查询成功', subscribeList: subscribeList })
  } catch (error) {
    return res.status(500).json({ msg: '查询失败', error: error })
  }
}

// 获取粉丝列表
exports.getFansList = async (req, res) => {
  const userId = req.params.userId
  const { pageNum = 1, pageSize = 10 } = req.query
  try {
    let fansList = await Subscribe
      .find({
        subscriber: userId
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate('user')
    fansList = fansList.map(item => {
      // 筛选粉丝的信息
      return lodash.pick(item.user, [
        '_id',
        'username',
        'image',
        'cover',
        'description',
        'subscribeCount',
        'fansCount'
      ])
    })
    return res.status(200).json({ msg: '查询成功', fansList: fansList })
  } catch (error) {
    return res.status(500).json({ msg: '查询失败', error: error })
  }
}