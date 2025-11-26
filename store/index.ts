/**
 * Zustand Store 统一导出
 * 组装所有状态切片
 */

// ============ 导出 User Store ============
export { 
  useUserStore, 
  useUser, 
  useIsAuthenticated, 
  useUserActions 
} from './slices/useUserSlice';

export type { UserInfo } from './slices/useUserSlice';

// ============ 未来可以添加更多切片 ============
// export { useDeviceStore } from './slices/useDeviceSlice';
// export { useTicketStore } from './slices/useTicketSlice';
// export { useCustomerStore } from './slices/useCustomerSlice';
// export { useEarningsStore } from './slices/useEarningsSlice';
