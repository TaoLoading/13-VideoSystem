|-- videoSystem
    |-- .gitignore
    |-- app.js // 入口文件
    |-- directoryList.md
    |-- package.json
    |-- README.md
    |-- yarn.lock
    |-- .vscode
    |   |-- settings.json
    |-- config // 配置信息
    |   |-- config.default.js
    |-- controller // 接口的逻辑处理
    |   |-- userController.js
    |   |-- videoController.js
    |   |-- vodController.js
    |-- middleware // 中间件的使用
    |   |-- validator // 负责校验的中间件
    |       |-- errorBack.js // 错误处理
    |       |-- userValidator.js // 用户相关校验规则
    |       |-- videoValidator.js // 视频相关校验规则
    |-- model // 数据库模型
    |   |-- baseModel.js
    |   |-- commentModel.js
    |   |-- index.js
    |   |-- subscribeModel.js
    |   |-- userModel.js
    |   |-- videoLikeModel.js
    |   |-- videoModel.js
    |-- router // 路由配置
    |   |-- index.js
    |   |-- user.js
    |   |-- video.js
    |-- upload // 存放上传的文件
    |   |-- img
    |   |-- video
    |-- utils // 工具函数
        |-- jwt.js
