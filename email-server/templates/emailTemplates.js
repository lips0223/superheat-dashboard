const magicLinkTemplate = (loginUrl, userEmail) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in to Superheat</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            padding: 40px;
            text-align: center;
            background-color: white;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }
        .subtitle {
            color: #666;
            font-size: 14px;
        }
        .content {
            padding: 0 40px 40px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 16px;
            text-align: center;
        }
        .description {
            color: #666;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 32px;
            text-align: center;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .login-button {
            display: inline-block;
            background-color: #ff6640;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
            transition: background-color 0.2s;
        }
        .login-button:hover {
            background-color: #e55a36;
        }
        .alternative-link {
            text-align: center;
            margin: 24px 0;
            font-size: 14px;
            color: #666;
        }
        .alternative-link a {
            color: #ff6640;
            text-decoration: none;
        }
        .security-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin-top: 32px;
        }
        .security-info p {
            margin: 0;
            font-size: 12px;
            color: #666;
            line-height: 1.4;
        }
        .security-info p + p {
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Superheat</div>
            <div class="subtitle">Manage devices, earnings, and operations in one place</div>
        </div>
        
        <div class="content">
            <div class="title">Sign in to Superheat</div>
            <div class="description">
                Click the button below to sign in to Superheat. This link will expire in 10 minutes.
            </div>
            
            <div class="button-container">
                <a href="${loginUrl}" class="login-button">Sign in to Superheat</a>
            </div>
            
            <div class="alternative-link">
                If you're having trouble with the above button, 
                <a href="${loginUrl}">click here</a>
            </div>
            
            <div class="security-info">
                <p>This email link was requested from ${getClientIP()} at ${new Date().toLocaleString()}.</p>
                <p>If you didn't make this request, you can safely ignore this email.</p>
                <p>This link will expire in 10 minutes for security reasons.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

// Helper function to get client IP (you might want to pass this as parameter)
function getClientIP() {
    // This is a placeholder - in real implementation, pass the IP from the request
    return 'Unknown IP';
}

/**
 * 验证码邮件模板
 * @param {string} verificationCode - 6位数字验证码
 * @param {string} userEmail - 用户邮箱
 * @param {number} expiresInMinutes - 过期时间（分钟）
 * @param {string} clientIP - 客户端IP地址
 */
const verificationCodeTemplate = (verificationCode, userEmail, expiresInMinutes = 10, clientIP = 'Unknown IP') => {
  // 格式化验证码为 "123 456" 格式
  const formattedCode = verificationCode.replace(/(\d{3})(\d{3})/, '$1 $2');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Verification Code - Superheat</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            padding: 40px;
            text-align: center;
            background-color: white;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }
        .subtitle {
            color: #666;
            font-size: 14px;
        }
        .content {
            padding: 0 40px 40px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 16px;
            text-align: center;
        }
        .description {
            color: #666;
            font-size: 16px;
            line-height: 1.5;
            text-align: center;
            margin-bottom: 32px;
        }
        .verification-code-container {
            text-align: center;
            margin: 32px 0;
        }
        .verification-code {
            display: inline-block;
            background-color: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px 30px;
            font-size: 32px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            color: #333;
            letter-spacing: 4px;
            margin: 0 auto;
            border-left: 4px solid #ff6640;
        }
        .code-instructions {
            color: #666;
            font-size: 14px;
            text-align: center;
            margin-top: 16px;
            line-height: 1.4;
        }
        .expiry-warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 16px;
            margin: 24px 0;
            text-align: center;
        }
        .expiry-warning p {
            margin: 0;
            color: #856404;
            font-size: 14px;
            font-weight: 500;
        }
        .security-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin-top: 32px;
        }
        .security-info p {
            margin: 0;
            font-size: 12px;
            color: #666;
            line-height: 1.4;
        }
        .security-info p + p {
            margin-top: 8px;
        }
        .highlight {
            color: #ff6640;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Superheat</div>
            <div class="subtitle">Manage devices, earnings, and operations in one place</div>
        </div>
        
        <div class="content">
            <div class="title">Your Verification Code</div>
            <div class="description">
                Enter the verification code below to complete your sign-in to Superheat.
            </div>
            
            <div class="verification-code-container">
                <div class="verification-code">${formattedCode}</div>
                <div class="code-instructions">
                    Enter this code in the app to continue
                </div>
            </div>
            
            <div class="expiry-warning">
                <p>⏰ This code will expire in <span class="highlight">${expiresInMinutes} minutes</span></p>
            </div>
            
            <div class="security-info">
                <p>This verification code was requested from <strong>${clientIP}</strong> at <strong>${new Date().toLocaleString()}</strong>.</p>
                <p>If you didn't make this request, you can safely ignore this email.</p>
                <p>For security reasons, do not share this code with anyone.</p>
                <p>The code can only be used once and will expire automatically.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = {
    magicLinkTemplate,
    verificationCodeTemplate
};