import React from "react";
import LoginForm from "./components/LoginForm";
import Image from "next/image";
// 这是一个服务端组件（默认），不需要添加任何指令
// 它负责渲染静态内容，LoginForm 是客户端组件负责交互
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white">
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#f7f7f7] relative">
        <Image
          src="/btc/btc-logo.svg"
          alt="btc"
          width={125}
          height={28}
          className="absolute top-10 left-12"
        />
        <Image src="/login.svg" alt="btc" width={659} height={510} />
      </div>
      <div className="flex-1 h-screen">
        <LoginForm />
      </div>
    </div>
  );
}
