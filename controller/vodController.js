/**
 * 本文件为阿里云vod视频点播服务相关配置
 * 
 * 注：实际上线项目中，视频管理由阿里云点播服务实现
 *    此版本为开发演示版，视频的管理由发起http请求对本地服务器中视频文件进行管理（实际项目中不可取）
 */

const RPCClient = require('@alicloud/pop-core').RPCClient

// 初始化AccessKey
function initVodClient(accessKeyId, accessKeySecret) {
  // 点播服务接入地域
  const regionId = 'cn-shanghai'
  const client = new RPCClient({
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
    apiVersion: '2017-03-21'
  })

  return client
}

// 获取vod视频上传凭证
exports.getVodKey = async (req, res) => {
  // 请求示例
  const client = initVodClient(
    'LTAI5t6N7W3BoSYpmtasXzoo',
    'GSedSGNfNDvUOGP1Txz5AnwAxfSsa3'
  )

  const vodBack = await client.request('CreateUploadVideo', {
    Title: 'this is a sample',
    FileName: 'filename.mp4'
  }, {})
  res.status(200).json({ vod: vodBack })
}