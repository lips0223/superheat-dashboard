import React, { useState, useEffect } from "react";
import type { DashboardList } from "../types";
import { getDashboardCardsByLocation } from "@/lib/mock";
import { useLocation } from "@/app/context/LocationContext";

export function useDashboard() {
  const { selectedLocation } = useLocation();
  const [dashboardData, setDashboardData] = useState<DashboardList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载延迟
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      const cards = getDashboardCardsByLocation(selectedLocation);
      setDashboardData(cards as DashboardList[]);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedLocation]);

  return {
    dashboardData,
    isLoading,
  };
}
