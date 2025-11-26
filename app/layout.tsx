import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocaleOnServer } from "@/i18n-config/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BTC Frontend",
  description: "A Bitcoin frontend application built with Next.js 15",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 服务端检测用户语言偏好
  const locale = await getLocaleOnServer();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
