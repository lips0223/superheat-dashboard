"use client";

import { useTranslation } from "react-i18next";
import { setLocaleOnClient } from "@/i18n-config/client";
import { useEffect, useState } from "react";
import Dashboard from "@/app/components/Dashboard";
export default function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (locale: "zh-Hans" | "en-US") => {
    setLocaleOnClient(locale, false);
  };


  return (
    <div className="flex flex-col h-full ">
      {/* 主体内容区域 - 仪表板内容 */}
      <Dashboard></Dashboard>
    </div>
  );
}
