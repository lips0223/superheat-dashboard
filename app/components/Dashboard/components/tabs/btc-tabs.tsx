import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChart, CHART_CONFIGS, ChartType, TimeRange } from "@/app/context/ChartContext";

export function SelectDemo() {
  const { selectedChart, setSelectedChart } = useChart();

  return (
    <Select value={selectedChart} onValueChange={(value) => setSelectedChart(value as ChartType)}>
      <SelectTrigger className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0">
        <SelectValue placeholder="Select a chart" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="btc-earnings">BTC Earnings</SelectItem>
          <SelectItem value="fleet-hashrate">Fleet Hashrate</SelectItem>
          <SelectItem value="fleet-water-temp">Fleet Water Temp</SelectItem>
          <SelectItem value="incidents">Incidents</SelectItem>
          <SelectItem value="tickets">Tickets</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="fleet-power-consumption">Fleet Power Consumption</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function TabsDemo() {
  const { timeRange, setTimeRange, getAvailableTimeRanges } = useChart();
  const availableRanges = getAvailableTimeRanges();

  // 时间范围标签映射
  const timeRangeLabels: Record<TimeRange, string> = {
    hourly: "Hourly",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  };

  return (
    <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableRanges.length}, 1fr)` }}>
        {availableRanges.map((range) => (
          <TabsTrigger key={range} value={range}>
            {timeRangeLabels[range]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export default function BTCtabs() {
  return (
    <div className="flex items-center justify-between ">
      <SelectDemo></SelectDemo>
      <TabsDemo></TabsDemo>
    </div>
  );
}
