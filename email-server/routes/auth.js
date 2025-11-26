const express = require('express');
const router = express.Router();
const gmailService = require('../config/gmail');
const TokenService = require('../utils/tokenService');
const verificationCodeService = require('../utils/verificationCodeService');
const { magicLinkTemplate, verificationCodeTemplate } = require('../templates/emailTemplates');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 预注册邮箱白名单
const AUTHORIZED_EMAILS = [
  'peanut02231@gmail.com'
];

// 用户信息存储 (在生产环境中应使用数据库)
const userStore = new Map();

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map();

// Simple rate limiting function
function checkRateLimit(email, maxAttempts = 3, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const key = `email:${email}`;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, firstAttempt: now });
    return true;
  }
  
  const record = rateLimitStore.get(key);
  
  // Reset if window has passed
  if (now - record.firstAttempt > windowMs) {
    rateLimitStore.set(key, { count: 1, firstAttempt: now });
    return true;
  }
  
  // Check if limit exceeded
  if (record.count >= maxAttempts) {
    return false;
  }
  
  // Increment count
  record.count++;
  return true;
}

// POST /api/auth/send-magic-link
router.post('/send-magic-link', async (req, res) => {
  try {
    const { email } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Rate limiting
    if (!checkRateLimit(email)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.'
      });
    }

    // Generate magic link
    const magicLink = TokenService.generateMagicLink(email);
    
    // Create email content
    const emailHtml = magicLinkTemplate(magicLink, email)
      .replace('${getClientIP()}', clientIP);

    // Send email
    await gmailService.sendEmail(
      email,
      'Your sign in link - Superheat',
      emailHtml
    );

    res.json({
      success: true,
      message: 'Magic link sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Error sending magic link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send magic link',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/auth/verify-token
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }

    // Verify token
    const verification = TokenService.verifyMagicToken(token);

    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        details: verification.error
      });
    }

    // In a real app, you would:
    // 1. Check if user exists in database
    // 2. Create session or JWT for authenticated user
    // 3. Return user data or session token

    res.json({
      success: true,
      message: 'Token verified successfully',
      email: verification.email,
      // In production, return a session token here
      sessionToken: 'temporary_session_token'
    });

  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({
      success: false,
      error: 'Token verification failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/auth/verify (for handling magic link clicks)
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=missing_token`);
    }

    // Verify token
    const verification = TokenService.verifyMagicToken(token);

    if (!verification.valid) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=invalid_token`);
    }

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?email=${encodeURIComponent(verification.email)}`);

  } catch (error) {
    console.error('Error in magic link verification:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=verification_failed`);
  }
});

// POST /api/auth/send-verification-code
router.post('/send-verification-code', async (req, res) => {
  try {
    const { email } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress || 'Unknown IP';

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_EMAIL',
        message: '请提供邮箱地址'
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: '请提供有效的邮箱地址'
      });
    }

    // Rate limiting check
    if (!checkRateLimit(email)) {
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMITED',
        message: '请求过于频繁，请稍后再试'
      });
    }

    // Generate verification code
    const codeResult = verificationCodeService.generateCodeForEmail(email);
    
    if (!codeResult.success) {
      return res.status(400).json(codeResult);
    }

    // Prepare email content
    const emailSubject = '您的 Superheat 验证码';
    const emailHtml = verificationCodeTemplate(
      codeResult.code,
      email,
      codeResult.expiresIn,
      clientIP
    );

    // Send email
    const emailResult = await gmailService.sendEmail({
      to: email,
      subject: emailSubject,
      html: emailHtml
    });

    if (!emailResult.success) {
      console.error('Failed to send verification code email:', emailResult.error);
      return res.status(500).json({
        success: false,
        error: 'EMAIL_SEND_FAILED',
        message: '验证码发送失败，请稍后重试'
      });
    }

    console.log(`[VerificationCode] 验证码已发送到 ${email}, Code: ${codeResult.code}`);

    // Return success (don't include the actual code in response for security)
    res.status(200).json({
      success: true,
      message: '验证码已发送到您的邮箱',
      email: email,
      expiresIn: codeResult.expiresIn,
      messageId: emailResult.messageId
    });

  } catch (error) {
    console.error('Error in send-verification-code:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '服务器内部错误，请稍后重试'
    });
  }
});

// POST /api/auth/verify-code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress || 'Unknown IP';

    // Validation
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: '请提供邮箱地址和验证码'
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: '请提供有效的邮箱地址'
      });
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CODE_FORMAT',
        message: '验证码必须是6位数字'
      });
    }

    // Verify code
    const verifyResult = verificationCodeService.verifyCode(email, code);

    if (!verifyResult.success) {
      console.log(`[VerificationCode] 验证失败 - ${email}: ${verifyResult.error}`);
      return res.status(400).json(verifyResult);
    }

    // Generate session token for successful verification
    const sessionToken = TokenService.generateMagicToken(email);

    console.log(`[VerificationCode] 验证成功 - ${email} from ${clientIP}`);

    // Return success with token
    res.status(200).json({
      success: true,
      message: '验证码验证成功',
      email: email,
      token: sessionToken,
      // Optional: include redirect URL
      redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login?verified=true`
    });

  } catch (error) {
    console.error('Error in verify-code:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '服务器内部错误，请稍后重试'
    });
  }
});

// GET /api/auth/code-status (optional endpoint to check code status)
router.get('/code-status', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: '请提供有效的邮箱地址'
      });
    }

    const status = verificationCodeService.getCodeStatus(email);

    res.status(200).json({
      success: true,
      email,
      status: status || { exists: false }
    });

  } catch (error) {
    console.error('Error in code-status:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '服务器内部错误'
    });
  }
});

// POST /api/auth/check-user-status - 检查用户邮箱授权状态和是否首次登录
router.post('/check-user-status', async (req, res) => {
  try {
    const { email } = req.body;

    // 验证邮箱格式
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: '请提供有效的邮箱地址'
      });
    }

    // 检查邮箱是否在白名单中
    const isAuthorized = AUTHORIZED_EMAILS.includes(email.toLowerCase());
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        authorized: false,
        error: 'EMAIL_NOT_AUTHORIZED',
        message: '该邮箱未被授权使用此系统'
      });
    }

    // 检查用户是否已有完整信息
    const userInfo = userStore.get(email.toLowerCase());
    const isFirstLogin = !userInfo || !userInfo.name || !userInfo.phone || !userInfo.company;

    res.status(200).json({
      success: true,
      authorized: true,
      isFirstLogin,
      email,
      userInfo: isFirstLogin ? null : userInfo
    });

  } catch (error) {
    console.error('Error in check-user-status:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '服务器内部错误'
    });
  }
});

// POST /api/auth/save-user-info - 保存用户信息
router.post('/save-user-info', async (req, res) => {
  try {
    const { email, name, phone, company } = req.body;

    // 验证必填字段
    if (!email || !name || !phone || !company) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: '请填写所有必填字段：邮箱、姓名、电话、公司'
      });
    }

    // 验证邮箱格式
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: '请提供有效的邮箱地址'
      });
    }

    // 检查邮箱是否授权
    if (!AUTHORIZED_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({
        success: false,
        error: 'EMAIL_NOT_AUTHORIZED',
        message: '该邮箱未被授权'
      });
    }

    // 保存用户信息
    const userInfo = {
      email: email.toLowerCase(),
      name: name.trim(),
      phone: phone.trim(),
      company: company.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    userStore.set(email.toLowerCase(), userInfo);

    console.log(`[UserInfo] 用户信息已保存 - ${email}: ${name}`);

    res.status(200).json({
      success: true,
      message: '用户信息保存成功',
      userInfo
    });

  } catch (error) {
    console.error('Error in save-user-info:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: '服务器内部错误'
    });
  }
});

module.exports = router;