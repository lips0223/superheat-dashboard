// 简单的授权URL生成器
require('dotenv').config();
const { google } = require('googleapis');

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

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('🔐 请访问以下URL进行授权：\n');
console.log(authUrl);
console.log('\n📋 授权后：');
console.log('1. 您会被重定向到: http://localhost:3001/auth/callback?code=xxxxxxx');
console.log('2. 复制URL中的code参数值');
console.log('3. 运行: node get-token.js YOUR_CODE_HERE');
console.log('\n⚠️  注意: 浏览器会显示"无法访问此网站"是正常的，只需复制URL中的code即可');