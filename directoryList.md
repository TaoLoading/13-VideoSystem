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
    |-- uploads // 上传的静态资源
    |   |-- 2b66bff0c66882fb8b20b95a2f50f0f3.jpg
    |-- utils // 工具函数
        |-- jwt.js
