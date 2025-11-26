"use client";

import React, { createContext, useContext, useState } from "react";

// 图表类型
export type ChartType = 
  | "btc-earnings" 
  | "fleet-hashrate" 
  | "fleet-water-temp" 
  | "incidents" 
  | "tickets" 
  | "sales"
  | "fleet-power-consumption";

// 时间范围类型
export type TimeRange = "hourly" | "daily" | "weekly" | "monthly";

// 图表配置
export const CHART_CONFIGS = {
  "btc-earnings": {
    label: "BTC Earnings",
    type: "bar" as const,
    timeRanges: ["daily", "weekly", "monthly"] as TimeRange[],
    defaultTimeRange: "daily" as TimeRange,
    hasYAxis: true,
  },
  "fleet-hashrate": {
    label: "Fleet Hashrate",
    type: "line" as const,
    timeRanges: ["hourly", "daily", "weekly", "monthly"] as TimeRange[],
    defaultTimeRange: "daily" as TimeRange,
    hasYAxis: false,
  },
  "fleet-water-temp": {
    label: "Fleet Water Temp",
    type: "line" as const,
    timeRanges: ["hourly", "daily", "weekly", "monthly"] as TimeRange[],
    defaultTimeRange: "daily" as TimeRange,
    hasYAxis: false,
  },
  "incidents": {
    label: "Incidents",
    type: "bar" as const,
    timeRanges: ["daily", "weekly", "monthly"] as TimeRange[],
    defaultTimeRange: "daily" as TimeRange,
    hasYAxis: true,
  },
  "tickets": {
    label: "Tickets",
    type: "bar" as const,
    timeRanges: ["daily", "weekly", "monthly"] as TimeRange[],
    defaultTimeRange: "daily" as TimeRange,
    hasYAxis: true,
  },
  "sales": {
    label: "Sales",
    type: "bar" as const,
    timeRanges: ["daily", "weekly", "monthly"] as TimeRange[],
    defaultTimeRange: "daily" as TimeRange,
    hasYAxis: true,
  },
  "fleet-power-consumption": {
    label: "Fleet Power Consumption",
    type: "line" as const,
    timeRanges: ["hourly", "daily", "weekly", "monthly"] as TimeRange[],
    defaultTimeRange: "daily" as TimeRange,
    hasYAxis: false,
  },
} as const;

interface ChartContextType {
  // 当前选择的图表
  selectedChart: ChartType;
  setSelectedChart: (chart: ChartType) => void;
  
  // 当前选择的时间范围
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  
  // 获取当前图表配置
  getCurrentConfig: () => typeof CHART_CONFIGS[ChartType];
  
  // 获取可用的时间范围选项
  getAvailableTimeRanges: () => TimeRange[];
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export function ChartProvider({ children }: { children: React.ReactNode }) {
  const [selectedChart, setSelectedChart] = useState<ChartType>("btc-earnings");
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  // 当图表类型改变时，自动设置为该图表的默认时间范围
  const handleSetSelectedChart = (chart: ChartType) => {
    setSelectedChart(chart);
    const config = CHART_CONFIGS[chart];
    setTimeRange(config.defaultTimeRange);
  };

  const getCurrentConfig = () => {
    return CHART_CONFIGS[selectedChart];
  };

  const getAvailableTimeRanges = () => {
    return CHART_CONFIGS[selectedChart].timeRanges;
  };

  return (
    <ChartContext.Provider
      value={{
        selectedChart,
        setSelectedChart: handleSetSelectedChart,
        timeRange,
        setTimeRange,
        getCurrentConfig,
        getAvailableTimeRanges,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
}

export function useChart() {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error("useChart must be used within a ChartProvider");
  }
  return context;
}
