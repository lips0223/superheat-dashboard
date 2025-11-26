"use client";

import React from "react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Settings, Play, Pause, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockDevices, Device } from "@/lib/mock";
import { useTranslation } from "react-i18next";
// 状态徽章组件
const StatusBadge = ({ status }: { status: Device["status"] }) => {
  const variants = {
    Online: "bg-green-100 text-green-800 hover:bg-green-100",
    Offline: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    Critical: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  return (
    <Badge variant="secondary" className={`${variants[status]} border-0`}>
      {status}
    </Badge>
  );
};

// 模式徽章组件
const ModeBadge = ({ mode }: { mode: Device["mode"] }) => {
  const variants = {
    Normal: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    Eco: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    Smart: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  };

  return (
    <Badge variant="secondary" className={`${variants[mode]} border-0`}>
      {mode}
    </Badge>
  );
};

interface DeviceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DeviceDetailPage({ params }: DeviceDetailPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const device = mockDevices.find((d) => d.id === resolvedParams.id);
  const { t } = useTranslation("");
  if (!device) {
    notFound();
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* 头部导航 */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('common.deviceDetail.title')}</h1>
          <p className="text-gray-500">View and manage device information</p>
        </div>
      </div>
    </div>
  );
}
