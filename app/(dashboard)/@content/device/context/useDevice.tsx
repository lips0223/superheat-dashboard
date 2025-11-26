"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getDeviceStatsByLocation } from "@/lib/mock";
import { useLocation } from "@/app/context/LocationContext";

// 设备状态类型
export type DeviceStatus = "online" | "offline" | "attention" | "critical" | "inactive";

// 设备统计数据类型
export interface DeviceStats {
  online: number;
  offline: number;
  attention: number;
  critical: number;
  total: number;
}

// 位置选项类型
export type LocationOption = "all" | string;

// Context 状态类型
interface DeviceContextType {
  // 设备统计
  deviceStats: DeviceStats;
  setDeviceStats: (stats: DeviceStats) => void;
  
  // 加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // 刷新数据
  refreshStats: () => Promise<void>;
  
  // 获取指定状态的设备数量
  getDeviceCount: (status: DeviceStatus) => number;
  
  // 获取总设备数
  getTotalDevices: () => number;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

// Provider 组件
export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const { selectedLocation } = useLocation();
  
  // 设备统计状态
  const [deviceStats, setDeviceStats] = useState<DeviceStats>({
    online: 48,
    offline: 25,
    attention: 1,
    critical: 1,
    total: 75,
  });
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 根据选择的位置获取设备统计数据
  const fetchDeviceStats = async (): Promise<DeviceStats> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getDeviceStatsByLocation(selectedLocation);
  };

  // 刷新统计数据
  const refreshStats = async () => {
    setIsLoading(true);
    try {
      const stats = await fetchDeviceStats();
      setDeviceStats(stats);
    } catch (error) {
      console.error("Failed to fetch device stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取指定状态的设备数量
  const getDeviceCount = (status: DeviceStatus): number => {
    switch (status) {
      case "online":
        return deviceStats.online;
      case "offline":
        return deviceStats.offline;
      case "attention":
        return deviceStats.attention;
      case "critical":
        return deviceStats.critical;
      default:
        return 0;
    }
  };

  // 获取总设备数
  const getTotalDevices = (): number => {
    return deviceStats.total;
  };

  // 初始化时获取数据，并监听 location 变化
  useEffect(() => {
    refreshStats();
  }, [selectedLocation]);

  const value: DeviceContextType = {
    deviceStats,
    setDeviceStats,
    isLoading,
    setIsLoading,
    refreshStats,
    getDeviceCount,
    getTotalDevices,
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
}

// Hook 使用 Context
export function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
}

// 设备卡片配置
export const deviceCardConfigs = [
  {
    key: "online" as const,
    title: "Online Devices",
    status: "online" as DeviceStatus,
    color: "text-[#47B881]",
  },
  {
    key: "offline" as const,
    title: "Offline Devices", 
    status: "offline" as DeviceStatus,
    color: "text-[#3B82F6]",
  },
  {
    key: "attention" as const,
    title: "Attention Devices",
    status: "attention" as DeviceStatus,
    color: "text-[#FFAD0D]",
  },
  {
    key: "critical" as const,
    title: "Critical Devices",
    status: "critical" as DeviceStatus,
    color: "text-[#F64C4C]",
  },
] as const;
