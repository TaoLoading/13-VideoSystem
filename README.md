## 视频系统（开发中）

### 系统介绍
基于Node.js实现的视频系统后端服务，主要包括以下功能：
1. 用户管理（注册/登录/修改/删除）
2. 视频管理（上传/展示/详情/删除）
3. 交互体验（订阅频道/取消订阅/粉丝/评论/删除评论/点赞视频/不喜欢视频）

### 文件目录结构
```md
|-- videoSystem
    |-- .gitignore
    |-- app.js // 入口文件
    |-- directoryList.md
    |-- package.json
    |-- README.md
    |-- yarn.lock
    |-- 接口文档（示例）.md
    |-- config // 配置信息
    |   |-- config.default.js
    |-- controller // 接口的逻辑处理
    |   |-- index.js
    |   |-- userController.js
    |   |-- videoController.js
    |   |-- vodController.js
    |-- middleware // 中间件的使用
    |   |-- validator // 负责校验的中间件
    |       |-- errorBack.js // 错误处理
    |       |-- userValidator.js // 校验规则
    |-- model // 数据库模型
    |   |-- baseModel.js
    |   |-- index.js
    |   |-- userModel.js
    |   |-- videoModel.js
    |-- router // 路由配置
    |   |-- index.js
    |   |-- user.js
    |   |-- video.js
    |-- upload // 存放上传的文件
    |   |-- img // 上传的图片
    |   |-- video // 上传的视频
    |-- utils // 工具函数
        |-- jwt.js
```

### 重点使用的包
1. mongoose：简化MongoDB的操作
2. express-validator：校验信息
3. multer：实现文件的上传
4. @alicloud/pop-core：对接阿里云视频点播服务

### 备注
1. 视频管理模块中
   1. 实际上线项目的视频管理由阿里云点播服务实现
   2. 此版本为开发演示版，视频的管理由发起http请求对本地服务器中视频文件进行管理
