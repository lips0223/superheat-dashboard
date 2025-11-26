import React, { useState, useEffect } from "react";
import {
  useCapture,
  useCaptureRef,
} from "../../../../context/captureContext/useCapture";
import BTCtabs from "../tabs/btc-tabs";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Image from "next/image";
import { useChart } from "@/app/context/ChartContext";
import { getChartData } from "@/lib/mock";

export function BTCCharts() {
  const { selectedChart, timeRange, getCurrentConfig } = useChart();
  const config = getCurrentConfig();
  
  // 获取当前图表数据
  const chartData = getChartData(selectedChart, timeRange);
  
  const chartConfig = {
    value: {
      label: config.label,
      color: "#FF6640",
    },
  } satisfies ChartConfig;

  // 使用两个 Hook: useCapture 获取电影级动画方法，useCaptureRef 获取 ref
  const { startCaptureSequence } = useCapture();
  const { ref: chartRef } = useCaptureRef();

  // 电影级动画截图处理函数
  const handleAnimatedCapture = async () => {
    try {
      if (!chartRef.current) {
        console.error("图表 ref 未绑定到元素");
        return;
      }

      // 触发电影级动画截图
      await startCaptureSequence(chartRef.current);
    } catch (error) {
      console.error("动画截图失败:", error);
    }
  };

  return (
    <div ref={chartRef}>
      <BTCtabs />
      {/* 这里可以添加更多的图表组件 */}
      <div>
        <Image
          src="/dashboard/Outline.svg"
          alt="Capture"
          width={36}
          height={36}
          className="mt-2 ml-auto cursor-pointer"
          onClick={handleAnimatedCapture}
        />
      </div>
      <div>
        <ChartContainer
          config={chartConfig}
          className="h-[253px] w-full py-6 mt-4"
        >
          {config.type === 'bar' ? (
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              {config.hasYAxis && (
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
              )}
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="#FF6640" radius={4} />
            </BarChart>
          ) : (
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#FF6640" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ChartContainer>
      </div>
    </div>
  );
}
