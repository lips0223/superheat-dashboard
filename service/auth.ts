import { supabase } from '@/lib/supabase';
import { UserInfo } from '@/store/slices/useUserSlice';

/**
 * 认证相关接口 - 使用 Supabase
 */

// ============ 请求/响应类型定义 ============

/** 登录请求参数 */
export interface LoginParams {
  email: string;
  password?: string;
}

/** 登录响应数据 */
export interface LoginResponseData {
  user: UserInfo;
  token: string;
}

/** Magic Link 请求参数 */
export interface MagicLinkParams {
  email: string;
}

/** Magic Link 响应数据 */
export interface MagicLinkResponseData {
  message: string;
  expireAt: string;
}

/** 发送验证码请求参数 */
export interface SendVerificationCodeParams {
  email: string;
}

/** 发送验证码响应数据 */
export interface SendVerificationCodeResponseData {
  success: boolean;
  message: string;
  email: string;
  expiresIn: number; // 分钟
  messageId?: string;
}

/** 验证验证码请求参数 */
export interface VerifyCodeParams {
  email: string;
  code: string;
}

/** 验证验证码响应数据 */
export interface VerifyCodeResponseData {
  success: boolean;
  message: string;
  email: string;
  token: string;
  redirectUrl?: string;
}

/** 验证码状态查询响应数据 */
export interface CodeStatusResponseData {
  success: boolean;
  email: string;
  status: {
    exists: boolean;
    expired?: boolean;
    verified?: boolean;
    attempts?: number;
    maxAttempts?: number;
    remainingTime?: number; // 秒
    canResend?: boolean;
  };
}

/** 验证 Magic Link 参数 */
export interface VerifyMagicLinkParams {
  token: string;
}

/** 注册请求参数 */
export interface RegisterParams {
  email: string;
  password: string;
  name: string;
}

/** 重置密码请求参数 */
export interface ResetPasswordParams {
  email: string;
}

/** 修改密码请求参数 */
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

/** 检查用户状态请求参数 */
export interface CheckUserStatusParams {
  userId?: string;  // Supabase user.id
  email: string;
}

/** 检查用户状态响应数据 */
export interface CheckUserStatusResponseData {
  success: boolean;
  authorized: boolean;
  isFirstLogin: boolean;
  email: string;
  userInfo?: UserInfo | null;
  error?: string;
  message?: string;
}

/** 保存用户信息请求参数 */
export interface SaveUserInfoParams {
  email: string;
  name: string;
  phone: string;
  company: string;
}

/** 保存用户信息响应数据 */
export interface SaveUserInfoResponseData {
  success: boolean;
  message: string;
  userInfo: UserInfo;
  error?: string;
}

// ============ API 方法 ============

/**
 * 邮箱发送验证码（使用 Supabase Auth）
 */
export const loginWithEmail = async (params: LoginParams) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: params.email,
      options: {
        shouldCreateUser: true,
      }
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: '验证码已发送到您的邮箱',
      email: params.email,
      data
    };
  } catch (error: any) {
    throw new Error(error.message || '发送验证码失败');
  }
};

/**
 * 发送验证码到邮箱（同上，兼容旧接口）
 */
export const sendVerificationCode = (params: SendVerificationCodeParams) => {
  return loginWithEmail({ email: params.email });
};

/**
 * 验证邮箱验证码
 */
export const verifyCode = async (params: VerifyCodeParams) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: params.email,
      token: params.code,
      type: 'email'
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: '验证成功',
      email: params.email,
      token: data.session?.access_token || '',
      data
    };
  } catch (error: any) {
    throw new Error(error.message || '验证码验证失败');
  }
};

/**
 * 查询验证码状态（Supabase 不需要此接口，保留用于兼容）
 */
export const getCodeStatus = async (email: string) => {
  // Supabase 自动管理验证码状态
  return {
    success: true,
    email,
    status: {
      exists: true,
      canResend: true
    }
  };
};

/**
 * 发送 Magic Link 到邮箱
 */
export const sendMagicLink = async (params: MagicLinkParams) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: params.email,
      options: {
        shouldCreateUser: true
      }
    });

    if (error) {
      throw error;
    }

    return {
      message: 'Magic link sent successfully',
      expireAt: new Date(Date.now() + 3600000).toISOString(),
      data
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send magic link');
  }
};

/**
 * 验证 Magic Link Token（保留用于兼容，实际由 Supabase 处理）
 */
export const verifyMagicLink = async (params: VerifyMagicLinkParams) => {
  // 通常 Magic Link 验证由 Supabase 自动处理
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Invalid magic link');
  }

  return {
    user: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || '',
      token: params.token
    },
    token: params.token
  };
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error('未登录');
    }

    // 查询 user_profiles 表获取完整信息
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      name: profile?.name || user.user_metadata?.name || '',
      phone: profile?.phone || '',
      company: profile?.company || '',
      avatar: user.user_metadata?.avatar_url,
      token: user.email!,
      role: profile?.role || 'user',
      createdAt: user.created_at,
      lastLoginAt: user.last_sign_in_at
    };
  } catch (error: any) {
    throw new Error(error.message || '获取用户信息失败');
  }
};

/**
 * 用户注册（Supabase 自动处理）
 */
export const register = async (params: RegisterParams) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          name: params.name
        }
      }
    });

    if (error) {
      throw error;
    }

    return {
      user: {
        id: data.user!.id,
        email: data.user!.email!,
        name: params.name,
        token: data.session?.access_token || ''
      },
      token: data.session?.access_token || ''
    };
  } catch (error: any) {
    throw new Error(error.message || '注册失败');
  }
};

/**
 * 登出
 */
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    throw new Error(error.message || '登出失败');
  }
};

/**
 * 请求重置密码（发送重置链接到邮箱）
 */
export const requestResetPassword = async (params: ResetPasswordParams) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(params.email);
    if (error) throw error;
  } catch (error: any) {
    throw new Error(error.message || '发送重置密码邮件失败');
  }
};

/**
 * 修改密码
 */
export const changePassword = async (params: ChangePasswordParams) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: params.newPassword
    });
    if (error) throw error;
  } catch (error: any) {
    throw new Error(error.message || '修改密码失败');
  }
};

/**
 * 刷新 Token
 */
export const refreshToken = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    
    return {
      token: data.session?.access_token || ''
    };
  } catch (error: any) {
    throw new Error(error.message || '刷新 Token 失败');
  }
};

/**
 * 检查用户邮箱授权状态和是否首次登录
 * 标准 Supabase 流程：必须使用 userId 查询
 */
export const checkUserStatus = async (userId: string) => {
  try {
    // 使用 user_id 查询 user_profiles 表
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 如果查询出错且不是"未找到"错误，抛出异常
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // 判断是否首次登录（没有 profile 或信息不完整）
    const isFirstLogin = !profile || !profile.name || !profile.phone || !profile.company;

    // 检查是否授权（如果有 is_authorized 字段）
    const isAuthorized = profile?.is_authorized !== false;

    return {
      success: true,
      authorized: isAuthorized,
      isFirstLogin,
      email: profile?.email || '',
      userInfo: profile || null,
      message: isAuthorized ? '' : '该邮箱未被授权使用此系统'
    };
  } catch (error: any) {
    console.error('检查用户状态失败:', error);
    throw new Error(error.message || '检查用户状态失败');
  }
};

/**
 * 保存用户信息（首次登录）
 * 标准 Supabase 流程：使用当前登录用户的 user_id
 */
export const saveUserInfo = async (params: SaveUserInfoParams) => {
  try {
    // 获取当前登录用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('用户未登录');
    }

    // 插入或更新 user_profiles 表
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,  // 使用 Supabase Auth 的 user.id
        email: user.email!, // 使用 Auth 用户的 email
        name: params.name,
        phone: params.phone,
        company: params.company,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: '用户信息保存成功',
      userInfo: {
        id: user.id,
        email: user.email!,
        name: params.name,
        phone: params.phone,
        company: params.company,
        token: user.email!
      },
      data
    };
  } catch (error: any) {
    console.error('保存用户信息失败:', error);
    throw new Error(error.message || '保存用户信息失败');
  }
};
