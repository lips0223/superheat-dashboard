import I18nClient from "@/app/components/i18n-client";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/app/components/Header/index";
import ClientProviders from "@/app/components/ClientProviders";
import { LocationProvider } from "@/app/context/LocationContext";

export default function DashboardLayout({
  children,
  menu,
  content,
}: Readonly<{
  children: React.ReactNode;
  menu: React.ReactNode;
  content: React.ReactNode;
}>) {
  return (
    <I18nClient>
      <ClientProviders>
        <LocationProvider>
          <SidebarProvider>
            <div className="flex h-screen w-full ">
              {/* 使用 @menu 插槽作为侧边栏 */}
              {menu}

              {/* 主内容区域 */}
              <main className="flex-1 flex flex-col min-w-0">
                {/* 顶部工具栏，包含侧边栏触发器和内容区域 */}
                <Header />
                {/* 页面主体内容 */}
                <div className="flex-1 p-4 pt-0 overflow-y-auto overflow-x-hidden min-w-0">{content || children}</div>
              </main>
            </div>
          </SidebarProvider>
        </LocationProvider>
      </ClientProviders>
    </I18nClient>
  );
}
