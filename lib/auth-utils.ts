import { UserInfo } from '@/store/slices/useUserSlice';

/**
 * 设置用户认证相关的cookies
 */
export function setAuthCookies(userInfo: UserInfo) {
  // 设置认证token cookie (httpOnly会更安全，但这里需要JS访问)
  document.cookie = `auth-token=${userInfo.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
  
  // 设置用户基本信息cookie（不包含敏感信息）
  const safeUserInfo = {
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    role: userInfo.role,
  };
  document.cookie = `user-info=${encodeURIComponent(JSON.stringify(safeUserInfo))}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
}

/**
 * 清除用户认证相关的cookies
 */
export function clearAuthCookies() {
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'user-info=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

/**
 * 处理登录成功逻辑
 */
export function handleLoginSuccess(userInfo: UserInfo) {
  // 设置cookies
  setAuthCookies(userInfo);
  
  // 检查是否有重定向参数
  const urlParams = new URLSearchParams(window.location.search);
  const redirectPath = urlParams.get('redirect');
  
  // 跳转到指定页面或首页
  const targetPath = redirectPath && redirectPath !== '/login' ? redirectPath : '/';
  window.location.href = targetPath;
}

/**
 * 处理登出逻辑
 */
export function handleLogout() {
  // 清除cookies
  clearAuthCookies();
  
  // 重定向到登录页
  window.location.href = '/login';
}