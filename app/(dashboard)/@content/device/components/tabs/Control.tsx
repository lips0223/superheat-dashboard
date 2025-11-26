import React, { useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function Control() {
  return (
    <div className="w-full">
      <div className="w-full border-b border-[#eee]">
        <div className="px-6 flex pb-4 items-center">
          <div className="flex ">
            <Image
              src="/device/mode_off_on.svg"
              alt="switch"
              width={20}
              height={20}
            ></Image>
            <p className="flex flex-col flex-1 ml-2 font-normal text-[12px] text-[#8e8e8e] leading-[18px]">
              <span className="text-[#1f1f1f] text-sm leading-[22px]">
                Device Power
              </span>
              Turn device on/off
            </p>
          </div>
          <Switch id="airplane-mode" className="ml-auto" />
        </div>
      </div>
      <div className="w-full border-b border-[#eee]">
        <div className="px-6 mt-[23px] pb-4 items-center">
          <div className="flex ">
            <Image
              src="/device/device_thermostat.svg"
              alt="switch"
              width={20}
              height={20}
            ></Image>
            <p className="flex flex-col flex-1 ml-2 font-normal text-[12px] text-[#8e8e8e] leading-[18px]">
              <span className="text-[#1f1f1f] text-sm leading-[22px]">
                Target Temperature
              </span>
            </p>
          </div>
          <Tabs defaultValue="account" className="w-full h-4 mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="px-6 mt-[23px] pb-4 items-center">
          <div className="flex ">
            <Image
              src="/device/network_node.svg"
              alt="switch"
              width={20}
              height={20}
            ></Image>
            <p className="flex flex-col flex-1 ml-2 font-normal text-[12px] text-[#8e8e8e] leading-[18px]">
              <span className="text-[#1f1f1f] text-sm leading-[22px]">
                Mode
              </span>
            </p>
          </div>
          <Tabs defaultValue="account" className="w-full h-4 mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="px-6 mt-[23px] pb-4 items-center mb-[23px]">
          <div className="flex ">
            <Image
              src="/device/calendar_clock.svg"
              alt="switch"
              width={20}
              height={20}
            ></Image>
            <p className="flex flex-col flex-1 ml-2 font-normal text-[12px] text-[#8e8e8e] leading-[18px]">
              <span className="text-[#1f1f1f] text-sm leading-[22px]">
                Heating Schedule
              </span>
            </p>
          </div>
          <Tabs defaultValue="account" className="w-full h-4 mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="w-full border-b border-[#eee]">
        <div className="px-6 flex pb-4 items-center">
          <div className="flex ">
            <Image
              src="/device/mode_off_on.svg"
              alt="switch"
              width={20}
              height={20}
            ></Image>
            <p className="flex flex-col flex-1 ml-2 font-normal text-[12px] text-[#8e8e8e] leading-[18px]">
              <span className="text-[#1f1f1f] text-sm leading-[22px]">
                Device Power
              </span>
              Turn device on/off
            </p>
          </div>
          <Switch id="airplane-mode" className="ml-auto" />
        </div>
      </div>
      <div className="w-full border-b border-[#eee]">
        <div className="px-6 flex pb-4 items-center">
          <div className="flex ">
            <Image
              src="/device/mode_off_on.svg"
              alt="switch"
              width={20}
              height={20}
            ></Image>
            <p className="flex flex-col flex-1 ml-2 font-normal text-[12px] text-[#8e8e8e] leading-[18px]">
              <span className="text-[#1f1f1f] text-sm leading-[22px]">
                Device Power
              </span>
              Turn device on/off
            </p>
          </div>
          <Switch id="airplane-mode" className="ml-auto" />
        </div>
      </div>
    </div>
  );
}
