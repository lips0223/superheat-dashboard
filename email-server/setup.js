// Google OAuth2 Setup Script
require('dotenv').config();
const { google } = require('googleapis');
const readline = require('readline');

// 从环境变量获取凭据
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ 错误: 缺少必要的环境变量');
  console.error('请在 .env 文件中设置 GOOGLE_CLIENT_ID 和 GOOGLE_CLIENT_SECRET');
  console.error('参考 .env.example 文件');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/gmail.send'];

// 步骤1：获取授权URL
console.log('=== Google OAuth2 Setup ===\n');

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent' // 强制显示同意屏幕以获取refresh token
});

console.log('1. 访问以下URL进行授权：');
console.log(authUrl);
console.log('\n2. 授权后，复制重定向URL中的code参数');

// 步骤2：获取tokens
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\n3. 请粘贴authorization code: ', (code) => {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error retrieving access token:', err);
      return;
    }
    
    console.log('\n✅ 成功获取tokens！');
    console.log('\n请将以下信息添加到.env文件：');
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GOOGLE_REDIRECT_URI=${REDIRECT_URI}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${token.refresh_token}`);
    
    rl.close();
  });
});

// 使用说明
console.log('\n=== 使用说明 ===');
console.log('1. 先在Google Cloud Console创建项目并启用Gmail API');
console.log('2. 创建OAuth2凭据');
console.log('3. 修改上面的CLIENT_ID和CLIENT_SECRET');
console.log('4. 运行: node setup.js');
console.log('5. 按照提示完成授权');
console.log('6. 将获取的token添加到.env文件');