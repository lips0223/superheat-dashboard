"use client";

import { useTranslation } from "react-i18next";
import { setLocaleOnClient } from "@/i18n-config/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
//shadcn的侧边栏组件
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Content() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  const handleLanguageChange = (locale: "zh-Hans" | "en-US") => {
    setLocaleOnClient(locale, false);
  };

  // 路由到菜单标题的映射
  const routeToTitle: Record<string, string> = {
    "/": t("common.menu.dashboard"),
    "/device": t("common.menu.devicemanager"),
    "/ticket": t("common.menu.ticketmanager"),
    "/earning": t("common.menu.earnings"),
    "/customer": t("common.menu.customermanage"),
  };

  // 生成面包屑数据
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      {
        title: "HomePage",
        href: "/",
        isCurrentPage: pathname === "/",
      },
    ];

    // 如果不是主页，添加面包屑路径
    if (pathname !== "/") {
      // 处理设备详情页面的特殊情况 /device/[id]
      if (pathname.startsWith("/device/") && pathname !== "/device") {
        // 先添加设备管理页面
        breadcrumbs.push({
          title: t("common.menu.devicemanager"),
          href: "/device",
          isCurrentPage: false,
        });
        
        // 再添加设备详情页面
        breadcrumbs.push({
          title: "Device Detail",
          href: pathname,
          isCurrentPage: true,
        });
      } else {
        // 其他页面的处理
        const currentTitle = routeToTitle[pathname] || "Unknown Page";
        breadcrumbs.push({
          title: currentTitle,
          href: pathname,
          isCurrentPage: true,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="flex items-center justify-between w-full h-15 px-4 ">
      <div className="flex items-center gap-1">
        {/* <SidebarTrigger /> */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.href} className="flex items-center">
                <BreadcrumbItem>
                  {breadcrumb.isCurrentPage ? (
                    <BreadcrumbPage 
                      className="text-sm font-normal cursor-pointer text-[#4b4b4b]"
                    >
                      {breadcrumb.title}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={breadcrumb.href}
                        className="text-sm font-normal cursor-pointer text-[#8e8e8e] hover:text-[#4b4b4b]"
                      >
                        {breadcrumb.title}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="mx-1">
                    <span className="text-[#8e8e8e] text-sm">/</span>
                  </BreadcrumbSeparator>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 语言切换按钮 */}
      {/* <div className="flex gap-2">
        <button
          onClick={() => handleLanguageChange("zh-Hans")}
          className={`px-3 py-1 rounded-md text-sm transition-all ${
            i18n.language === "zh-Hans"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          中文
        </button>
        <button
          onClick={() => handleLanguageChange("en-US")}
          className={`px-3 py-1 rounded-md text-sm transition-all ${
            i18n.language === "en-US"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          English
        </button>
      </div> */}
    </div>
  );
}
