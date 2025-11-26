"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import { useMap } from "react-leaflet";
import Image from "next/image";
import "leaflet/dist/leaflet.css";

// 动态导入地图组件,禁用SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// 地图尺寸调整组件
function MapResizer({ isExpanded }: { isExpanded: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    // 使用适当的延迟确保过渡动画完成后再调整地图
    const timer = setTimeout(() => {
      try {
        const container = map.getContainer();
        const { clientHeight, clientWidth } = container;
        
        // 只有当容器有有效尺寸时才调整地图大小
        if (clientHeight > 0 && clientWidth > 0) {
          map.invalidateSize({ animate: true });
        }
      } catch (error) {
        // 静默处理错误,不输出到控制台
      }
    }, 550); // 等待过渡动画完成(500ms) + 50ms buffer
    
    return () => clearTimeout(timer);
  }, [isExpanded, map]);
  
  return null;
}

// 热力图组件
function HeatmapLayer({ points }: { points: Array<{ lat: number; lng: number; intensity: number }> }) {
  const map = useMap();

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    let heatLayer: any = null;
    
    // 动态导入 leaflet.heat
    import("leaflet.heat").then((module) => {
      const L = require("leaflet");
      
      // 转换数据格式: [lat, lng, intensity]
      const heatData = points.map((p) => [p.lat, p.lng, p.intensity] as [number, number, number]);
      
      // 创建热力图层 - 使用正确的 API
      // @ts-ignore
      heatLayer = L.heatLayer(heatData, {
        radius: 30,
        blur: 25,
        maxZoom: 17,
        max: 1.0,
        gradient: { 0.4: "blue", 0.6: "lime", 1: "red" },
      });
      
      heatLayer.addTo(map);
    });
    
    // 清理函数
    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points]);

  return null;
}

interface MapComponentProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function MapComponent({ isExpanded = false, onToggle }: MapComponentProps) {
  // 模拟数据：热力点、标记点、区域排名
  const mapData = {
    heatPoints: [
      { lat: 37.7749, lng: -122.4194, intensity: 0.8 }, // 旧金山
      { lat: 37.8044, lng: -122.2711, intensity: 0.6 }, // 奥克兰
      { lat: 40.7128, lng: -74.006, intensity: 0.7 }, // 纽约
    ],
    markers: [
      {
        lat: 37.7749,
        lng: -122.4194,
        count: 24,
        address: "4041 Collins Ave",
        online: 28,
        attention: 2,
      },
      {
        lat: 37.8044,
        lng: -122.2711,
        count: 15,
        address: "Oakland Center",
        online: 15,
        attention: 3,
      },
      {
        lat: 40.7128,
        lng: -74.006,
        count: 5,
        address: "New York Hub",
        online: 8,
        attention: 1,
      },
    ],
    topAreas: [
      { name: "San Francisco", value: 377 },
      { name: "Oakland", value: 298 },
      { name: "New York", value: 245 },
    ],
  };

  // 修复Leaflet默认图标问题
  useEffect(() => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });
    }
  }, []);

  // 创建自定义图标
  const createCustomIcon = (count: number) => {
    if (typeof window === "undefined") return undefined;
    const L = require("leaflet");
    return L.divIcon({
      html: `<div style="background: #ff523b; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${count}</div>`,
      className: "custom-marker",
      iconSize: [30, 30],
    });
  };

  const centerPosition: LatLngExpression = [37.7749, -122.4194];

  return (
    <div className="w-full flex flex-col">
      <div 
        className="relative -mx-4"
        style={{
          height: isExpanded ? '340px' : '340px',
          transition: 'height 0.5s ease-in-out',
        }}
      >
        {typeof window !== "undefined" && (
          <MapContainer
            // @ts-ignore - dynamic import causes type issues
            center={centerPosition}
            zoom={10}
            style={{ 
              height: "100%", 
              width: "100%", 
              borderRadius: '0',
            }}
            scrollWheelZoom={false}
            attributionControl={false}
            zoomControl={false}
          >
            <TileLayer
              // @ts-ignore
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* 地图尺寸调整组件 */}
            <MapResizer isExpanded={isExpanded} />

            {/* 热力图层 */}
            <HeatmapLayer points={mapData.heatPoints} />

            {/* 标记点与弹窗 */}
            {mapData.markers.map((marker, index) => (
              <Marker
                key={index}
                // @ts-ignore
                position={[marker.lat, marker.lng] as LatLngExpression}
                icon={createCustomIcon(marker.count)}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold mb-2">{marker.address}</p>
                    <p className="flex items-center mb-1">
                      <span className="inline-block w-2 h-2 bg-[#47B881] rounded-full mr-2"></span>
                      Online {marker.online}
                    </p>
                    <p className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-[#F64C4C] rounded-full mr-2"></span>
                      Attention {marker.attention}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
        
        {/* 展开/收起按钮 */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="absolute right-4 bottom-4 z-[2000] cursor-pointer bg-white rounded-lg shadow-lg p-1 hover:scale-110 active:scale-95"
            style={{ 
              zIndex: 2000,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Image
              src={isExpanded ? "/dashboard/unexpand.svg" : "/dashboard/expand.svg"}
              alt={isExpanded ? "收起" : "展开"}
              width={36}
              height={36}
              style={{
                transition: 'all 0.3s ease-in-out',
              }}
            />
          </button>
        )}
      </div>

      {/* 区域排名 - 始终显示 */}
      <div className="mt-4">
        <h3 className="font-semibold mb-3 text-sm">Top Areas</h3>
        <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {mapData.topAreas.map((area) => (
            <li key={area.name} className="flex items-center gap-2">
              <span className="font-medium text-foreground">{area.name}</span>
              <span className="text-xs">({area.value})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
