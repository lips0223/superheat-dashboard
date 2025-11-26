"use client";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();

  // BTC Frontend 主菜单项
  const mainItems = [
    {
      title: t("common.menu.dashboard"),
      url: "/",
      activeIcon: "/btc/dashboard.svg",
      icon: "/dashboard/dashboard_unactive.svg",
    },
    {
      title: t("common.menu.devicemanager"),
      url: "/device",
      icon: "/btc/devicemanager.svg",
      activeIcon: "/dashboard/device_active.svg",
    },
    {
      title: t("common.menu.ticketmanager"),
      url: "/ticket",
      icon: "/btc/ticketmanager.svg",
      activeIcon: "/dashboard/ticket_active.svg",
    },
    {
      title: t("common.menu.earnings"),
      url: "/earning",
      icon: "/btc/earning.svg",
      activeIcon: "/dashboard/btc_active.svg",
    },
    {
      title: t("common.menu.customermanage"),
      url: "/customer",
      icon: "/btc/customermanager.svg",
      activeIcon: "/dashboard/user_active.svg",
    },
  ];

  // 底部菜单项
  const bottomItems = [
    {
      title: t("common.menu.settings"),
      url: "/settings",
      icon: "/btc/setting.svg",
      activeIcon: "/dashboard/btc_active.svg",
    },
    {
      title: t("common.menu.helper"),
      url: "/help",
      icon: "/btc/helper.svg",
      activeIcon: "/dashboard/user_active.svg",
    },
  ];

  return (
    <Sidebar className="bg-[#F5F5F5]" collapsible="icon">
      <SidebarHeader className={`px-3 py-2.5 ${open ? '' : 'flex justify-center'}`}>
        <div className="flex items-center gap-2 justify-between ">
          {open && (
            <Image
              src={"/btc/btc-logo.svg"}
              alt="BTC Frontend Logo"
              width={125}
              height={28}
              className="w-auto h-auto max-w-full"
            />
          )}
          <button 
            onClick={toggleSidebar}
            className="flex justify-center ml-1 hover:opacity-80 transition-opacity"
          >
            <Image 
              src={"/btc/expand.svg"} 
              alt="Toggle Sidebar" 
              width={36} 
              height={36}
              className={`transition-transform duration-200 ${!open ? 'rotate-180' : ''} cursor-pointer flex justify-center`}
            />
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-4 border-t border-[#E1E1E1] flex flex-col">
        {/* 主菜单区域 */}
        <SidebarGroup className="flex-1">
          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {mainItems.map((item) => {
                // 修改激活逻辑：支持路径前缀匹配
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={`${isActive ? "bg-[#FF6640]" : ""} ${
                      isActive ? "hover:bg-[#FF6640]" : ""
                    } rounded-[8px] px-4 py-3 text-white ${
                      !isActive ? "text-[#8E8E8E]" : ""
                    } ${
                      item.url === "/"
                        ? "relative after:content-[''] after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-[1px] after:bg-[#E1E1E1]"
                        : ""
                    } ${item.url === "/" ? "mb-8" : ""} ${
                      item.url === "/customer"
                        ? "mt-8 relative after:content-[''] after:absolute after:top-[-16px] after:left-0 after:right-0 after:h-[1px] after:bg-[#E1E1E1]"
                        : ""
                    } group-data-[collapsible=icon]:!px-2 group-data-[collapsible=icon]:justify-center`}
                  >
                    <SidebarMenuButton
                      asChild
                      className={` p-0 h-auto hover:bg-transparent hover:text-current active:bg-transparent active:text-current focus-visible:ring-0 data-[active=true]:bg-transparent data-[active=true]:text-current data-[state=open]:hover:bg-transparent data-[state=open]:hover:text-current [&>a>img]:!w-6 [&>a>img]:!h-6 `}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 "
                      >
                        <Image
                          src={isActive ? item.activeIcon : item.icon}
                          alt={item.title}
                          width={24}
                          height={24}
                          className="flex-shrink-0"
                        ></Image>
                        {open && <span className="text-base">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 底部菜单区域 */}
        <SidebarGroup className="pb-5">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item, index) => {
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={`${isActive ? "bg-[#FF6640]" : ""} ${
                      isActive ? "hover:bg-[#FF6640]" : ""
                    } rounded-[8px] px-4 py-3 text-white ${
                      !isActive ? "text-[#8E8E8E]" : ""
                    } ${index === bottomItems.length - 1 ? "" : "mb-2"} group-data-[collapsible=icon]:!px-2 group-data-[collapsible=icon]:justify-center`}
                  >
                    <SidebarMenuButton
                      asChild
                      className={` p-0 h-auto hover:bg-transparent hover:text-current active:bg-transparent active:text-current focus-visible:ring-0 data-[active=true]:bg-transparent data-[active=true]:text-current data-[state=open]:hover:bg-transparent data-[state=open]:hover:text-current [&>a>img]:!w-6 [&>a>img]:!h-6 `}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 "
                      >
                        <Image
                          src={isActive ? item.activeIcon : item.icon}
                          alt={item.title}
                          width={24}
                          height={24}
                          className="flex-shrink-0"
                        ></Image>
                        {open && <span className="text-base">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
