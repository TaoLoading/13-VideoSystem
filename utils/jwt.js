const jwt = require('jsonwebtoken')
const { promisify } = require('util')

// promise化
const newSign = promisify(jwt.sign)
const verify = promisify(jwt.verify)

// 生成token
module.exports.createToken = async userInfo => {
  const token = await newSign(
    { userInfo },
    'taoloading1999',
    {
      // 过期时间
      expiresIn: 60 * 60 * 24 * 7
    }
  )
  return token
}

// 校验token
module.exports.verifyToken = async (req, res, next) => {
  const tokenStr = req.headers.authorization
  const token = tokenStr ? tokenStr.split('Bearer ')[1] : null

  if (!token) {
    res.status(401).json({ error: '未传入token' })
  }
  try {
    const userInfo = await verify(token, 'taoloading1999')
    req.user = userInfo
    next()
  } catch (error) {
    res.status(401).json({ error: '当前token无效' })
  }
  next()
}