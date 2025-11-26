"use client";
import React, { useState, useEffect } from "react";
import MapComponent from "./Map";

interface MapProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function Map({ isExpanded, onToggle }: MapProps) {
  return (
    <div 
      className="px-4 py-5 bg-white rounded-lg shadow border border-[#E1E1E1] flex flex-col"
    >
      <div 
        className="border-b border-[#e1e1e1] pb-4 -mx-4 px-4"
      >
        HeatMap
      </div>
      <div 
        className="flex-1 flex flex-col min-h-0"
      >
        <MapComponent isExpanded={isExpanded} onToggle={onToggle} />
      </div>
    </div>
  );
}
