/**
 * 验证码生成和验证服务
 * 处理6位数字验证码的生成、存储、验证和过期管理
 */

class VerificationCodeService {
  constructor() {
    // 存储验证码信息 (生产环境建议使用 Redis)
    this.codeStore = new Map();
    
    // 配置选项
    this.config = {
      codeLength: 6,                    // 验证码长度
      expireTime: 10 * 60 * 1000,       // 过期时间 10分钟
      maxAttempts: 5,                   // 最大尝试次数
      resendInterval: 60 * 1000,        // 重发间隔 1分钟
      cleanupInterval: 30 * 60 * 1000   // 清理过期数据间隔 30分钟
    };

    // 定期清理过期数据
    this.startCleanupTimer();
  }

  /**
   * 生成6位随机数字验证码
   */
  generateCode() {
    const min = Math.pow(10, this.config.codeLength - 1);
    const max = Math.pow(10, this.config.codeLength) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 为指定邮箱生成并存储验证码
   * @param {string} email - 邮箱地址
   * @returns {Object} - { code, expireAt, canResend }
   */
  generateCodeForEmail(email) {
    const now = Date.now();
    const existing = this.codeStore.get(email);

    // 检查是否可以重新发送
    if (existing && (now - existing.createdAt) < this.config.resendInterval) {
      const remainingTime = Math.ceil((this.config.resendInterval - (now - existing.createdAt)) / 1000);
      return {
        success: false,
        error: 'RESEND_TOO_SOON',
        message: `请等待 ${remainingTime} 秒后再次发送`,
        remainingTime
      };
    }

    const code = this.generateCode();
    const expireAt = now + this.config.expireTime;

    // 存储验证码信息
    this.codeStore.set(email, {
      code: code.toString(),
      createdAt: now,
      expireAt,
      attempts: 0,
      verified: false
    });

    return {
      success: true,
      code: code.toString(),
      expireAt,
      expiresIn: this.config.expireTime / 1000 / 60 // 分钟
    };
  }

  /**
   * 验证邮箱的验证码
   * @param {string} email - 邮箱地址
   * @param {string} inputCode - 用户输入的验证码
   * @returns {Object} - 验证结果
   */
  verifyCode(email, inputCode) {
    const stored = this.codeStore.get(email);
    const now = Date.now();

    // 检查验证码是否存在
    if (!stored) {
      return {
        success: false,
        error: 'CODE_NOT_FOUND',
        message: '验证码不存在或已过期，请重新获取'
      };
    }

    // 检查是否已过期
    if (now > stored.expireAt) {
      this.codeStore.delete(email);
      return {
        success: false,
        error: 'CODE_EXPIRED',
        message: '验证码已过期，请重新获取'
      };
    }

    // 检查是否已验证
    if (stored.verified) {
      return {
        success: false,
        error: 'CODE_ALREADY_USED',
        message: '验证码已使用，请重新获取'
      };
    }

    // 检查尝试次数
    if (stored.attempts >= this.config.maxAttempts) {
      this.codeStore.delete(email);
      return {
        success: false,
        error: 'MAX_ATTEMPTS_EXCEEDED',
        message: '验证失败次数过多，请重新获取验证码'
      };
    }

    // 增加尝试次数
    stored.attempts++;

    // 验证码不匹配
    if (stored.code !== inputCode.toString()) {
      const remainingAttempts = this.config.maxAttempts - stored.attempts;
      return {
        success: false,
        error: 'CODE_MISMATCH',
        message: `验证码错误，还可尝试 ${remainingAttempts} 次`,
        remainingAttempts
      };
    }

    // 验证成功
    stored.verified = true;
    
    // 可选：立即删除已验证的码，或保留一段时间防止重复使用
    // this.codeStore.delete(email);

    return {
      success: true,
      message: '验证码验证成功',
      email
    };
  }

  /**
   * 获取验证码状态信息
   * @param {string} email - 邮箱地址
   * @returns {Object|null} - 验证码状态
   */
  getCodeStatus(email) {
    const stored = this.codeStore.get(email);
    if (!stored) return null;

    const now = Date.now();
    const isExpired = now > stored.expireAt;
    const remainingTime = Math.max(0, stored.expireAt - now);

    return {
      exists: true,
      expired: isExpired,
      verified: stored.verified,
      attempts: stored.attempts,
      maxAttempts: this.config.maxAttempts,
      remainingTime: Math.ceil(remainingTime / 1000), // 秒
      canResend: (now - stored.createdAt) >= this.config.resendInterval
    };
  }

  /**
   * 清理指定邮箱的验证码
   * @param {string} email - 邮箱地址
   */
  clearCode(email) {
    return this.codeStore.delete(email);
  }

  /**
   * 清理所有过期的验证码
   */
  cleanupExpiredCodes() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [email, data] of this.codeStore.entries()) {
      if (now > data.expireAt || data.verified) {
        this.codeStore.delete(email);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[VerificationCode] 清理了 ${cleanedCount} 个过期验证码`);
    }

    return cleanedCount;
  }

  /**
   * 启动定期清理定时器
   */
  startCleanupTimer() {
    setInterval(() => {
      this.cleanupExpiredCodes();
    }, this.config.cleanupInterval);

    console.log('[VerificationCode] 验证码清理定时器已启动');
  }

  /**
   * 获取当前存储的验证码数量（用于监控）
   */
  getStoreSize() {
    return this.codeStore.size;
  }

  /**
   * 格式化验证码（添加空格便于阅读）
   * @param {string} code - 原始验证码
   * @returns {string} - 格式化后的验证码
   */
  static formatCode(code) {
    // 将6位数字验证码格式化为 "123 456" 的形式
    return code.replace(/(\d{3})(\d{3})/, '$1 $2');
  }
}

// 创建单例实例
const verificationCodeService = new VerificationCodeService();

module.exports = verificationCodeService;