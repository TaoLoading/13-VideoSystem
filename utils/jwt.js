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

/**
 * 校验token
 * @param isRequired 是否必须传入token
 */
module.exports.verifyToken = function (isRequired = true) {
  return async (req, res, next) => {
    // 拿到token
    const tokenStr = req.headers.authorization
    const token = tokenStr ? tokenStr.split('Bearer ')[1] : null

    if (!token) {
      // 判断是否需要token
      if (isRequired) {
        return res.status(401).json({ error: '未传入token' })
      } else {
        return next()
      }
    }
    try {
      const userInfo = await verify(token, 'taoloading1999')
      req.user = userInfo
      return next()
    } catch (error) {
      return res.status(401).json({ error: '当前token无效' })
    }
  }
}