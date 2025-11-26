import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// 卡片骨架屏
export function DashboardCardSkeleton() {
  return (
    <div className="h-[182px] w-full rounded-lg border border-gray-200 bg-white p-5 shadow">
      {/* 标题区域 */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
      {/* 数值区域 */}
      <Skeleton className="h-9 w-32 mt-2" />
      {/* 提示信息区域 */}
      <div className="flex items-center gap-1 mt-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      {/* Tabs 区域 */}
      <div className="mt-4">
        <Skeleton className="h-7 w-32 rounded-full" />
      </div>
    </div>
  );
}

// BTC图表骨架屏
export function BTCChartsSkeleton() {
  return (
    <div className="space-y-4">
      {/* 标题和按钮区域 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
      {/* Tabs 区域 */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
      {/* 图表区域 */}
      <Skeleton className="h-[300px] w-full rounded-md" />
    </div>
  );
}

// 地图和图表骨架屏
export function MapAndChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 mt-6">
      {/* Charts 骨架屏 */}
      <div className="px-4 py-5 bg-white rounded-lg shadow border border-[#E1E1E1] h-full flex flex-col">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Skeleton className="h-[250px] w-[250px] rounded-full" />
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Map 骨架屏 */}
      <div className="px-4 py-5 bg-white rounded-lg shadow border border-[#E1E1E1] h-full flex flex-col">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="flex-1">
          <Skeleton className="h-[340px] w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
