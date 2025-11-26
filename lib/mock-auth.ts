/**
 * Mock 认证服务 - 用于本地开发（网络无法访问 Supabase 时）
 * 设置 NEXT_PUBLIC_USE_MOCK=true 启用
 */

export interface MockUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  is_authorized: boolean;
}

// Mock 用户数据库
const mockUsers: Map<string, MockUser> = new Map();

// 预设一些测试用户
const presetUsers: MockUser[] = [
  {
    id: 'mock-user-1',
    email: 'peanut0212025@outlook.com',
    name: '测试用户',
    phone: '13800138000',
    company: '测试公司',
    is_authorized: true
  },
  {
    id: 'mock-user-2',
    email: 'test@example.com',
    name: undefined,
    phone: undefined,
    company: undefined,
    is_authorized: true
  },
  {
    id: 'mock-user-3',
    email: 'unauthorized@example.com',
    is_authorized: false
  }
];

// 初始化 Mock 数据
presetUsers.forEach(user => {
  mockUsers.set(user.email, user);
});

// Mock 验证码存储
const mockOtpCodes: Map<string, { code: string; expiresAt: number }> = new Map();

/**
 * Mock 发送验证码
 */
export const mockSendOtp = async (email: string) => {
  console.log('🔧 [Mock] 发送验证码到:', email);
  
  // 生成 6 位验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 保存验证码，5分钟有效
  mockOtpCodes.set(email, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000
  });
  
  console.log('🔧 [Mock] 验证码:', code);
  
  // 如果用户不存在，自动创建
  if (!mockUsers.has(email)) {
    mockUsers.set(email, {
      id: `mock-user-${Date.now()}`,
      email,
      is_authorized: true
    });
  }
  
  return {
    success: true,
    message: '验证码已发送',
    email,
    expiresIn: 5
  };
};

/**
 * Mock 验证 OTP
 */
export const mockVerifyOtp = async (email: string, code: string) => {
  console.log('🔧 [Mock] 验证码验证:', email, code);
  
  const otpData = mockOtpCodes.get(email);
  
  if (!otpData) {
    throw new Error('验证码不存在或已过期');
  }
  
  if (otpData.expiresAt < Date.now()) {
    mockOtpCodes.delete(email);
    throw new Error('验证码已过期');
  }
  
  if (otpData.code !== code) {
    throw new Error('验证码错误');
  }
  
  // 验证成功，清除验证码
  mockOtpCodes.delete(email);
  
  const user = mockUsers.get(email);
  
  return {
    success: true,
    message: '验证成功',
    email,
    token: `mock-token-${Date.now()}`,
    data: {
      user: user ? {
        id: user.id,
        email: user.email,
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      } : null,
      session: {
        access_token: `mock-token-${Date.now()}`,
        refresh_token: `mock-refresh-${Date.now()}`,
        expires_in: 3600
      }
    }
  };
};

/**
 * Mock 检查用户状态
 */
export const mockCheckUserStatus = async (userId?: string, email?: string) => {
  console.log('🔧 [Mock] 检查用户状态:', { userId, email });
  
  // 优先使用 userId 查找
  let user: MockUser | undefined;
  
  if (userId) {
    user = Array.from(mockUsers.values()).find(u => u.id === userId);
  } else if (email) {
    user = mockUsers.get(email);
  }
  
  if (!user) {
    return {
      success: true,
      authorized: true,
      isFirstLogin: true,
      email: email || '',
      userInfo: null,
      message: ''
    };
  }
  
  // 判断是否首次登录
  const isFirstLogin = !user.name || !user.phone || !user.company;
  
  return {
    success: true,
    authorized: user.is_authorized,
    isFirstLogin,
    email: user.email,
    userInfo: isFirstLogin ? null : {
      id: user.id,
      email: user.email,
      name: user.name!,
      phone: user.phone!,
      company: user.company!,
      token: user.email
    },
    message: user.is_authorized ? '' : '该邮箱未被授权使用此系统'
  };
};

/**
 * Mock 保存用户信息
 */
export const mockSaveUserInfo = async (params: {
  email: string;
  name: string;
  phone: string;
  company: string;
}) => {
  console.log('🔧 [Mock] 保存用户信息:', params);
  
  const user = mockUsers.get(params.email);
  
  if (!user) {
    throw new Error('用户不存在');
  }
  
  // 更新用户信息
  user.name = params.name;
  user.phone = params.phone;
  user.company = params.company;
  
  mockUsers.set(params.email, user);
  
  return {
    success: true,
    message: '用户信息保存成功',
    userInfo: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      company: user.company,
      token: user.email
    }
  };
};

/**
 * 查看所有 Mock 用户（调试用）
 */
export const getMockUsers = () => {
  return Array.from(mockUsers.values());
};

/**
 * 查看所有验证码（调试用）
 */
export const getMockOtpCodes = () => {
  return Array.from(mockOtpCodes.entries()).map(([email, data]) => ({
    email,
    code: data.code,
    expiresAt: new Date(data.expiresAt).toISOString()
  }));
};
