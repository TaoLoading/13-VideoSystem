const jwt = require('jsonwebtoken')
const { promisify } = require('util')

// sign promise化
const newSign = promisify(jwt.sign)

// 生成token
module.exports.createToken = async userInfo => {
  return await newSign(
    { userInfo },
    'taoloading1999',
    {
      // 过期时间
      expiresIn: 60 * 60
    }
  )
}

// 校验token
module.exports.verifyToken = async (req, res, next) => {
  console.log('---', req.headers.authorization)
  next()
}