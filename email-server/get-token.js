// 根据授权码获取refresh token
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

// 从命令行参数获取授权码
const authCode = process.argv[2];

if (!authCode) {
  console.log('❌ 请提供授权码！');
  console.log('用法: node get-token.js YOUR_AUTHORIZATION_CODE');
  process.exit(1);
}

console.log('🔄 正在获取tokens...');

oauth2Client.getToken(authCode, (err, token) => {
  if (err) {
    console.error('❌ 获取access token失败:', err);
    return;
  }
  
  console.log('\n✅ 成功获取tokens！');
  console.log('\n📝 请将以下refresh token添加到.env文件：');
  console.log(`GOOGLE_REFRESH_TOKEN=${token.refresh_token}`);
  console.log('\n🎉 配置完成后，您就可以启动邮件服务器了！');
});