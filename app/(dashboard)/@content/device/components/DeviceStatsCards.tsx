"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useDevice, deviceCardConfigs } from "../context/useDevice";

export default function DeviceStatsCards() {
  const { getDeviceCount, isLoading } = useDevice();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {deviceCardConfigs.map((config) => {
        const count = getDeviceCount(config.status);
        
        return (
          <Card 
            key={config.key}
            className={`border transition-all hover:shadow-md h-[108px]`}
          >
            <CardContent >
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {config.title}
                </h3>
                <div className={`text-3xl font-medium ${config.color}`}>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-9 w-12 rounded"></div>
                  ) : (
                    count
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}