"use client";

import { useState } from "react";
import Charts from "./charts";
import Map from "./map";

export default function MapAndCharts() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="pb-6 mt-6"
    >
      {isExpanded ? (
        // 扩大状态：地图在上，图表在下
        <div className="flex flex-col gap-6">
          <div className="w-full">
            <Map
              isExpanded={isExpanded}
              onToggle={() => setIsExpanded(!isExpanded)}
            />
          </div>
          <div className="w-full md:w-1/2">
            <Charts />
          </div>
        </div>
      ) : (
        // 正常状态：并排显示
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Charts />
          <Map
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
          />
        </div>
      )}
    </div>
  );
}
