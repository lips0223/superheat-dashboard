"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function Charts() {
  const chartData = [
    { browser: "Online", visitors: 275, fill: "#47B881" },
    { browser: "Offline", visitors: 200, fill: "#F1CD49" },
    { browser: "Attention", visitors: 287, fill: "#F64C4C" },
    { browser: "Unactivated", visitors: 173, fill: "#E1E1E1" },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Online",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Offline",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Attention",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Unactivated",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);
  return ( 
    <div className="px-4 py-5 bg-white rounded-lg shadow border border-[#E1E1E1] h-full flex flex-col">
      <div className="border-b border-[#e1e1e1] pb-4 -mx-4 px-4">Fleet Status</div>
      <div className="flex-1 flex flex-col">
        <Card className="flex flex-col border-none shadow-none flex-1">
          {/* <CardHeader className="items-center pb-0">
            <CardTitle>Pie Chart - Donut with Text</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader> */}
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel indicator="dot" />}
                />
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  nameKey="browser"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalVisitors.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex gap-6 flex-wrap">
              {chartData.map((item) => (
                <div key={item.browser} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.browser}
                  </span>
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
