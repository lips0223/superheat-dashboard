"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import DeviceInfo from "./tabs/DeviceInfo";
import { Tabs } from "antd";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Control from "./tabs/Control";
import { Device } from "@/lib/mock";

// // 状态徽章组件
// const StatusBadge = ({ status }: { status: Device["status"] }) => {
//   const variants = {
//     Online: "bg-green-100 text-green-800 hover:bg-green-100",
//     Offline: "bg-gray-100 text-gray-800 hover:bg-gray-100",
//     Critical: "bg-red-100 text-red-800 hover:bg-red-100",
//   }

//   return (
//     <Badge variant="secondary" className={`${variants[status]} border-0`}>
//       {status}
//     </Badge>
//   )
// }

interface DeviceControlDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: Device | null;
}

export default function DeviceControlDrawer({
  open,
  onOpenChange,
  device,
}: DeviceControlDrawerProps) {
  const [cluster, setCluster] = React.useState("");

  if (!device) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-[400px] max-w-[400px] fixed right-0 top-0 bottom-0 rounded-none border-l border-gray-200 bg-white">
        {/* 头部 */}
        <DrawerHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center ">
            <DrawerClose asChild>
              {/* <Button variant="ghost" size="sm" className="h-auto p-1">
                <X className="h-5 w-5" />
              </Button> */}
              <Image
                src="/device/drawer_close.svg"
                alt="close"
                width={28}
                height={28}
                className="cursor-pointer"
              ></Image>
            </DrawerClose>
            <Separator orientation="vertical" className="mx-4" />
            <div className="flex items-center space-x-3">
              <DrawerTitle className="text-lg font-medium text-[#1f1f1f]">
                Batch Operations (2 devices)
              </DrawerTitle>
            </div>
          </div>
        </DrawerHeader>

        {/* 内容区域 */}
        <div className="">
          <Tabs
            defaultActiveKey="1"
            style={
              {
                "--ant-primary-color": "#ff6640",
              } as React.CSSProperties
            }
            className="custom-orange-tabs "
            items={[
              {
                key: "1",
                label: "Device Info",
                children: <DeviceInfo />,
              },
              {
                key: "2",
                label: "Control",
                children: <Control />,
              },
            ]}
          />
        </div>
        {/* 底部按钮 */}
        <DrawerFooter className="px-6 py-4 border-t border-gray-200">
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              className="border-none shadow-none hover:bg-transparent hover:bg-none cursor-pointer w-[98px] h-[36px] "
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className=" bg-[#ff6640] text-white hover:bg-[#e55a36] cursor-pointer  w-[98px] h-[36px] "
              onClick={() => {
                // 保存逻辑
                console.log("Saving device settings...");
                onOpenChange(false);
              }}
            >
              Save
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
