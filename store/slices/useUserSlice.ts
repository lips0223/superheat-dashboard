import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setAuthCookies, clearAuthCookies } from '@/lib/auth-utils';

// 用户信息接口
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  token: string;
  role?: 'admin' | 'user' | 'customer';
  createdAt?: string;
  lastLoginAt?: string;
}

// 用户状态接口
interface UserState {
  // 现有状态
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // 新增：登录流程状态
  emailVerified: boolean;
  isFirstLogin: boolean;
  userEmail: string | null;
  
  // 现有Actions
  setUser: (user: UserInfo) => void;
  updateUser: (user: Partial<UserInfo>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  
  // 新增Actions
  setEmailVerified: (verified: boolean) => void;
  setFirstLogin: (isFirst: boolean) => void;
  setUserEmail: (email: string | null) => void;
  resetAuthFlow: () => void;
}

// 创建持久化的用户状态 store
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 现有初始状态
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // 新增：登录流程状态初始值
      emailVerified: false,
      isFirstLogin: false,
      userEmail: null,

      // 现有方法：设置用户信息（登录）
      setUser: (user: UserInfo) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // 设置认证cookies
        if (typeof window !== 'undefined') {
          setAuthCookies(user);
        }
      },

      // 更新用户信息（部分更新）
      updateUser: (userData: Partial<UserInfo>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...userData,
            },
          });
        }
      },

      // 登出
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          // 清除登录流程状态
          emailVerified: false,
          isFirstLogin: false,
          userEmail: null,
        });
        
        // 清除cookies和本地存储
        if (typeof window !== 'undefined') {
          clearAuthCookies();
          localStorage.removeItem('auth-token');
          // 可以添加其他清理逻辑
        }
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // 新增：登录流程相关方法
      setEmailVerified: (verified: boolean) => {
        set({ emailVerified: verified });
      },

      setFirstLogin: (isFirst: boolean) => {
        set({ isFirstLogin: isFirst });
      },

      setUserEmail: (email: string | null) => {
        set({ userEmail: email });
      },

      resetAuthFlow: () => {
        set({
          emailVerified: false,
          isFirstLogin: false,
          userEmail: null,
        });
      },
    }),
    {
      name: 'superheat-user-storage', // localStorage 中的 key
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
      // 可选：只持久化部分字段
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        emailVerified: state.emailVerified,
        isFirstLogin: state.isFirstLogin,
        userEmail: state.userEmail,
        // 不持久化 isLoading
      }),
    }
  )
);

// 导出选择器 hooks（用于性能优化）
export const useUser = () => useUserStore((state) => state.user);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useUserActions = () => useUserStore((state) => ({
  setUser: state.setUser,
  updateUser: state.updateUser,
  logout: state.logout,
  setLoading: state.setLoading,
}));
