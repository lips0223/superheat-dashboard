# Superheat Email Server

一个使用Google Gmail API免费额度的Node.js + Express邮件验证服务器。

## 📋 功能特性

- 使用Gmail API发送邮件（免费额度）
- Magic Link身份验证
- 速率限制保护
- JWT token验证
- 专业的HTML邮件模板
- CORS支持

## 🚀 快速开始

### 1. 安装依赖

```bash
cd email-server
npm install
```

### 2. Google API设置

#### 2.1 创建Google Cloud项目
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用Gmail API

#### 2.2 创建OAuth 2.0凭据
1. 转到"APIs & Services" > "Credentials"
2. 点击"Create Credentials" > "OAuth client ID"
3. 选择"Web application"
4. 添加重定向URI：`http://localhost:3001/auth/callback`
5. 保存Client ID和Client Secret

#### 2.3 获取Refresh Token
运行以下脚本获取refresh token：

```javascript
// 在email-server目录创建setup.js文件
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'http://localhost:3001/auth/callback'
);

const scopes = ['https://www.googleapis.com/auth/gmail.send'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('访问这个URL并授权：', url);
console.log('授权后，将code参数的值粘贴到下面的代码中');

// 获取到code后，运行以下代码
// oauth2Client.getToken('YOUR_AUTHORIZATION_CODE', (err, token) => {
//   if (err) return console.error('Error retrieving access token', err);
//   console.log('Refresh token:', token.refresh_token);
// });
```

### 3. 环境配置

复制 `.env.example` 到 `.env` 并填入你的配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# Gmail API Configuration
GOOGLE_CLIENT_ID=你的客户端ID
GOOGLE_CLIENT_SECRET=你的客户端密钥
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/callback
GOOGLE_REFRESH_TOKEN=你的刷新令牌

# JWT Secret (生成一个随机字符串)
JWT_SECRET=你的JWT密钥

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Gmail Configuration
GMAIL_USER=你的Gmail地址
```

### 4. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 📡 API接口

### 发送验证邮件
```http
POST /api/auth/send-magic-link
Content-Type: application/json

{
  "email": "user@example.com"
}
```

响应：
```json
{
  "success": true,
  "message": "Magic link sent successfully",
  "email": "user@example.com"
}
```

### 验证Token
```http
POST /api/auth/verify-token
Content-Type: application/json

{
  "token": "jwt_token_here"
}
```

响应：
```json
{
  "success": true,
  "message": "Token verified successfully",
  "email": "user@example.com",
  "sessionToken": "session_token"
}
```

### Magic Link验证（GET请求）
```
GET /api/auth/verify?token=jwt_token_here
```

自动重定向到前端页面。

## 🔧 前端集成

在你的前端应用中调用API：

```javascript
// 发送验证邮件
const sendMagicLink = async (email) => {
  const response = await fetch('http://localhost:3001/api/auth/send-magic-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  return response.json();
};

// 验证token
const verifyToken = async (token) => {
  const response = await fetch('http://localhost:3001/api/auth/verify-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  
  return response.json();
};
```

## 🛡️ 安全特性

- **速率限制**：每个邮箱15分钟内最多3次请求
- **Token过期**：Magic link 10分钟后自动过期
- **JWT验证**：安全的token验证机制
- **CORS保护**：只允许指定域名访问

## 🚨 注意事项

1. **Gmail API配额**：免费额度每天10亿配额单位，足够个人项目使用
2. **生产环境**：建议使用专业邮件服务（SendGrid、Mailgun等）
3. **数据库**：当前使用内存存储，生产环境应使用Redis或数据库
4. **错误处理**：已包含基本错误处理，可根据需求扩展
5. **日志记录**：建议添加更详细的日志记录

## 📁 项目结构

```
email-server/
├── config/          # 配置文件
│   └── gmail.js     # Gmail API配置
├── routes/          # 路由文件
│   └── auth.js      # 认证相关路由
├── templates/       # 邮件模板
│   └── emailTemplates.js
├── utils/           # 工具函数
│   └── tokenService.js
├── .env.example     # 环境变量示例
├── package.json     # 项目依赖
└── server.js        # 主服务器文件
```

## 🔍 故障排除

如果遇到问题，请检查：

1. Google API凭据是否正确配置
2. Gmail API是否已启用
3. Refresh token是否有效
4. 环境变量是否正确设置
5. 网络连接是否正常

## 📝 License

MIT