import React, { useState, useEffect } from "react";
import { useDashboard } from "./hooks/useDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import LocationSelector from "@/components/ui/LocationSelector";
import SelectDemo from "./Select";
import { BTCCharts } from "./components/charts/btc-charts";
import MapAndCharts from "../MapAndCharts";
import {
  DashboardCardSkeleton,
  BTCChartsSkeleton,
  MapAndChartsSkeleton,
} from "./components/DashboardSkeleton";
import { ChartProvider } from "@/app/context/ChartContext";

export default function Dashboard() {
  const { dashboardData, isLoading } = useDashboard();

  console.log("Dashboard data:", dashboardData);

  return (
    <ChartProvider>
      <div className="h-full">
        <div className="flex items-center justify-between">
          <p className="text-[#1F1F1F] text-[30px] font-normal">Dashboard</p>
          <div>
            <LocationSelector />
          </div>
        </div>

      {/* 卡片网格区域 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4 pb-4">
        {isLoading ? (
          // 显示骨架屏
          <>
            {Array.from({ length: 7 }).map((_, index) => (
              <DashboardCardSkeleton key={index} />
            ))}
          </>
        ) : (
          // 显示实际数据
          dashboardData.map((item) => (
            <div
              key={item.id}
              className="h-[182px] w-full rounded-lg border border-gray-200 bg-white p-5 shadow"
            >
              {/* Render item content here */}
              <div className="flex items-center gap-2 text-[#1F1F1F] text-sm font-normal">
                <Image src={item.icon} alt="cs" width={20} height={20}></Image>
                <div>{item.title}</div>
              </div>
              <div className="flex items-center text-[30px] text-[#1F1F1F] mt-2">
                <div>{item.value}</div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-[#8e8e8e]">
                {item.status === "warning" && (
                  <Image
                    src="/dashboard/Attention.svg"
                    alt="warning"
                    width={16}
                    height={16}
                  ></Image>
                )}
                {item.status === "critical" && (
                  <Image
                    src="/dashboard/Time.svg"
                    alt="Time"
                    width={16}
                    height={16}
                  ></Image>
                )}
                <p
                  className={`${
                    item.up
                      ? item.up === "water"
                        ? "text-[#EC2D30]"
                        : "text-[#0C9D61]"
                      : ""
                  } ${item.tip?.includes("+") ? "text-[#0C9D61]" : ""} ${
                    item.url ? "cursor-pointer" : ""
                  }`}
                >
                  {item.tip}
                </p>
                {item.up && (
                  <Image
                    src={`${
                      item.tip?.includes("-")
                        ? item.up === "water"
                          ? "/dashboard/waterDown"
                          : "/dashboard/powerDown"
                        : item.up === "water"
                        ? "/dashboard/waterUp"
                        : "/dashboard/performanceup"
                    }.svg`}
                    alt="recent"
                    width={16}
                    height={16}
                  ></Image>
                )}
                {item.url && (
                  <Image
                    src={`${
                      !item.tip?.includes("+")
                        ? "/dashboard/rightE8.svg"
                        : "/dashboard/right09.svg"
                    }`}
                    alt="right"
                    width={16}
                    height={16}
                  ></Image>
                )}
              </div>
              <div>
                {item?.tabs && item.tabs.length > 0 && (
                  <Tabs defaultValue={item.tabs[0].name} className="mt-4">
                    <TabsList className="inline-flex">
                      {item.tabs.map((tab) => (
                        <TabsTrigger
                          key={tab.name}
                          value={tab.name}
                          className="px-3 py-[3px]"
                        >
                          {tab.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* BTC图表区域 */}
      <div className="mt-6 border border-[#E1E1E1] rounded-lg p-4 bg-white shadow">
        {isLoading ? <BTCChartsSkeleton /> : <BTCCharts />}
      </div>

      {/* 地图和图表区域 */}
      {isLoading ? <MapAndChartsSkeleton /> : <MapAndCharts />}
    </div>
    </ChartProvider>
  );
}
