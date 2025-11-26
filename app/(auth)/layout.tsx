import type { Metadata } from "next";
import "../globals.css";
import I18nClient from "../components/i18n-client";
import { getLocaleOnServer } from "@/i18n-config/server";

export const metadata: Metadata = {
  title: "Auth - BTC Frontend",
  description: "Authentication for BTC Frontend",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocaleOnServer();

  return (
    <I18nClient>
      {/* Auth 页面不需要侧边栏和 Header，只有纯净的认证界面 */}
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </I18nClient>
  );
}
